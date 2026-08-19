/** Prerenders the homepage into dist/index.html after `vite build`.
 *
 * The site is a client-rendered SPA: without JS the raw HTML has ~1 character of text, so
 * crawlers/AI fetchers that don't execute JS (GPTBot, ChatGPT-User, …) see an empty page.
 * This serves the freshly built dist/ over plain HTTP, loads it in the system Chrome, waits for
 * React (and its animations) to settle, and writes back the DOM React actually produced — same
 * markup, same CSS, no hidden text, no cloaking.
 *
 * Served on 127.0.0.1 (NOT localhost) on purpose: src/components/firebase/firebase.ts connects
 * to the Firestore emulator only when `location.hostname === 'localhost'`, so 127.0.0.1 makes
 * the prerender read production Firestore and capture the real data.
 *
 * Chrome is driven over the DevTools protocol with node's built-in WebSocket instead of
 * `chrome --dump-dom`: under `--virtual-time-budget` the GSAP/framer-motion clocks never advance,
 * so --dump-dom froze the intro overlay on screen and left ~40 elements at `opacity: 0`.
 * ponytail: raw CDP, no puppeteer-core — node 24 ships fetch + WebSocket, this needs ~5 calls.
 */
import { spawn } from 'node:child_process'
import { createServer } from 'node:http'
import { existsSync, readFileSync, readdirSync, writeFileSync, copyFileSync, statSync, mkdtempSync, rmSync } from 'node:fs'
import { join, resolve, extname, normalize } from 'node:path'
import { tmpdir } from 'node:os'

const DIST = resolve(process.cwd(), 'dist')
const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const SETTLE_TIMEOUT_MS = 45000

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.txt': 'text/plain', '.xml': 'application/xml',
  '.mp4': 'video/mp4', '.webm': 'video/webm',
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** Rimpiazzata più sotto: process.exit() salta il `finally`, quindi la pulizia la fa fail(). */
let cleanup = () => {}

const fail = (msg) => {
  process.stderr.write(`\n[prerender] ${msg}\n`)
  cleanup()
  process.exit(1)
}

if (!existsSync(CHROME)) {
  fail(`Chrome non trovato in "${CHROME}".\n           Imposta la variabile d'ambiente CHROME_PATH con il percorso completo di chrome.exe,\n           es. CHROME_PATH="C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" npm run build`)
}
if (!existsSync(join(DIST, 'index.html'))) {
  fail(`${join(DIST, 'index.html')} non esiste — esegui prima "vite build".`)
}

/** Server statico di dist/ con fallback SPA a index.html. */
const server = createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname)
  const candidate = normalize(join(DIST, urlPath))
  let file = join(DIST, 'index.html')
  if (candidate.startsWith(DIST) && existsSync(candidate) && statSync(candidate).isFile()) file = candidate
  res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' })
  res.end(readFileSync(file))
})

// I processi figli di Chrome tengono il profilo bloccato ancora per un istante dopo il kill, così
// la rimozione a fine run a volte fallisce. Ripulisco all'avvio i profili delle build precedenti,
// altrimenti ogni deploy lascia 25-60 MB in %TEMP%.
for (const dir of readdirSync(tmpdir()).filter((n) => n.startsWith('cnc-prerender-'))) {
  try { rmSync(join(tmpdir(), dir), { recursive: true, force: true }) } catch { /* ancora in uso */ }
}

const profileDir = mkdtempSync(join(tmpdir(), 'cnc-prerender-'))
let chrome = null
let ws = null

cleanup = () => {
  try { ws?.close() } catch { /* già chiuso */ }
  if (chrome && chrome.exitCode === null) chrome.kill('SIGKILL')
  server.close()
  try { rmSync(profileDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 }) } catch { /* profilo temporaneo, amen */ }
}

/** Il popup promozioni parte con un timer di 3s: congelarlo nell'HTML statico lo mostrerebbe a
 *  tutti al primo paint. Lo marco come "già visto oggi" con la stessa chiave che usa Home.tsx. */
const SEED = `try { localStorage.setItem('cnc_promo_last_seen', new Date().toISOString().slice(0, 10)) } catch { /* storage negato */ }`

/** Nessun elemento fermo a `opacity: 0` (stato iniziale di framer-motion) e intro GSAP conclusa. */
const SETTLED = `!document.querySelector('[class*="_intro_"]') && ![...document.querySelectorAll('[style*="opacity"]')].some(el => /opacity:\\s*0(?![.\\d])/.test(el.getAttribute('style') || ''))`

/** Scorre tutta la pagina e torna in cima: le sezioni usano useInView({ once: true }), senza
 *  scroll restano per sempre a opacity 0. `once: true` le tiene visibili anche al ritorno in cima,
 *  dove invece va catturato lo stato legato allo scroll (es. l'hint "scorri" dell'hero). */
const SCROLL_THROUGH = `(async () => {
  const wait = (ms) => new Promise(r => setTimeout(r, ms))
  for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.8) {
    scrollTo(0, y); await wait(150)
  }
  scrollTo(0, 1e7); await wait(800)   // l'ultima sezione entra in vista solo al fondo vero
  scrollTo(0, 0);   await wait(800)
})()`

/** Elementi ancora fermi a opacity 0, per un messaggio d'errore che dica davvero cosa manca. */
const STUCK = `JSON.stringify([...document.querySelectorAll('[style*="opacity"]')].filter(el => /opacity:\\s*0(?![.\\d])/.test(el.getAttribute('style') || '')).map(el => el.className).slice(0, 8))`

try {
  await new Promise((ok) => server.listen(0, '127.0.0.1', ok))
  const url = `http://127.0.0.1:${server.address().port}/`
  process.stdout.write(`[prerender] rendering ${url} …\n`)

  chrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--remote-debugging-port=0',
    '--window-size=1280,900', '--hide-scrollbars',
    '--no-first-run', '--no-default-browser-check', '--disable-extensions',
    `--user-data-dir=${profileDir}`, 'about:blank',
  ], { stdio: 'ignore' })
  chrome.on('error', (err) => fail(`impossibile avviare Chrome (${CHROME}): ${err.message}`))

  // Chrome scrive la porta DevTools scelta nel profilo appena è pronto.
  const portFile = join(profileDir, 'DevToolsActivePort')
  let devtoolsPort = null
  for (let i = 0; i < 150 && !devtoolsPort; i++) {
    await sleep(100)
    if (existsSync(portFile)) devtoolsPort = readFileSync(portFile, 'utf-8').split('\n')[0].trim() || null
  }
  if (!devtoolsPort) fail('Chrome non ha esposto la porta DevTools entro 15s.')

  let target = null
  for (let i = 0; i < 50 && !target; i++) {
    const list = await (await fetch(`http://127.0.0.1:${devtoolsPort}/json/list`)).json()
    target = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl)
    if (!target) await sleep(100)
  }
  if (!target) fail('nessun target "page" trovato su DevTools.')

  ws = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((ok, ko) => {
    ws.addEventListener('open', ok, { once: true })
    ws.addEventListener('error', () => ko(new Error('connessione DevTools fallita')), { once: true })
  })

  let nextId = 0
  const pending = new Map()
  ws.addEventListener('message', (e) => {
    const msg = JSON.parse(e.data)
    pending.get(msg.id)?.(msg)
    pending.delete(msg.id)
  })
  const send = (method, params) => new Promise((ok) => {
    const id = ++nextId
    pending.set(id, ok)
    ws.send(JSON.stringify({ id, method, params }))
  })
  const evaluate = async (expression) => {
    const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
    return res.result?.exceptionDetails ? undefined : res.result?.result?.value
  }
  const waitFor = async (expression, what) => {
    const deadline = Date.now() + SETTLE_TIMEOUT_MS
    while (Date.now() < deadline) {
      if (await evaluate(expression) === true) return
      await sleep(250)
    }
    const stuck = await evaluate(STUCK)
    fail(`timeout ${SETTLE_TIMEOUT_MS}ms in attesa di: ${what}.\n           elementi ancora a opacity 0: ${stuck ?? '(non leggibili)'}\n           dist/index.html lasciato invariato.`)
  }

  await send('Page.addScriptToEvaluateOnNewDocument', { source: SEED })
  await send('Page.navigate', { url })

  await waitFor(`!!document.querySelector('a[href="/listino-prezzi/"]')`, 'il render di React (link footer listino)')
  await evaluate(SCROLL_THROUGH)
  await waitFor(SETTLED, 'la fine delle animazioni (nessun elemento a opacity 0, intro conclusa)')

  // Il cookie banner compare a tempo: congelarlo nell'HTML statico lo farebbe lampeggiare
  // anche a chi ha già scelto. È React a decidere se mostrarlo, non lo snapshot.
  await evaluate(`document.querySelector('[aria-label="Cookie banner"]')?.remove()`)

  const dom = await evaluate(`'<!doctype html>\\n' + document.documentElement.outerHTML`)
  if (typeof dom !== 'string') fail('impossibile leggere il DOM da Chrome. dist/index.html lasciato invariato.')

  // Mai scrivere un output non validato: meglio l'index.html di Vite che una home rotta.
  const problems = []
  if (dom.length <= 20000) problems.push(`DOM troppo corto (${dom.length} caratteri, attesi > 20000)`)
  if (!dom.includes('listino-prezzi')) problems.push('manca il link footer "listino-prezzi" (React non ha renderizzato?)')
  if (!dom.includes('Sciacca')) problems.push('manca la parola "Sciacca" (dati Firestore non caricati?)')
  if (problems.length) {
    fail(`prerender NON valido, dist/index.html lasciato invariato:\n           - ${problems.join('\n           - ')}`)
  }

  // La shell vuota di Vite resta disponibile come fallback SPA: le rewrite di firebase.json
  // puntano lì, così le rotte non prerenderizzate non servono l'HTML della home (niente lampo).
  // Se la copia fallisce l'eccezione arriva al catch qui sotto: build in errore, nessuna scrittura.
  copyFileSync(join(DIST, 'index.html'), join(DIST, 'app.html'))
  process.stdout.write('[prerender] dist/app.html scritto (shell SPA di Vite, fallback rewrite)\n')

  writeFileSync(join(DIST, 'index.html'), dom, 'utf-8')
  process.stdout.write(`[prerender] dist/index.html aggiornato (${dom.length} caratteri)\n`)
} catch (err) {
  fail(`errore durante il prerender, dist/index.html lasciato invariato: ${err.message}`)
} finally {
  cleanup()
}
