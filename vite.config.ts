import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** `15.00` -> `15`, `27.50` -> `27,50` (Italian decimal comma, trailing `.00` dropped). */
const formatPrice = (amount: string) => amount.replace(/\.00$/, '').replace('.', ',')

/** Renders the llms.txt markdown subset (headings, quote, bullet list, plain lines) as HTML. */
function renderListinoBody(llmsTxt: string): string {
  const out: string[] = []
  let inList = false
  const closeList = () => {
    if (inList) {
      out.push('</ul>')
      inList = false
    }
  }

  for (const raw of llmsTxt.split(/\r?\n/)) {
    const line = raw.trim()
    if (!line) {
      closeList()
    } else if (line.startsWith('# ')) {
      closeList() // page <h1> is fixed, the llms.txt title is dropped
    } else if (line.startsWith('### ')) {
      closeList()
      out.push(`<h3>${escapeHtml(line.slice(4))}</h3>`)
    } else if (line.startsWith('## ')) {
      closeList()
      out.push(`<h2>${escapeHtml(line.slice(3))}</h2>`)
    } else if (line.startsWith('> ')) {
      closeList()
      out.push(`<p>${escapeHtml(line.slice(2))}</p>`)
    } else if (line.startsWith('- ')) {
      const item = line.slice(2)
      if (!inList) {
        out.push('<ul>')
        inList = true
      }
      const link = item.match(/^\[(.+)\]\((\S+)\)$/)
      const price = item.match(/^(.*) — (\d+(?:\.\d+)?) EUR$/)
      if (link) out.push(`<li><a href="${escapeHtml(link[2])}">${escapeHtml(link[1])}</a></li>`)
      else if (price) out.push(`<li>${escapeHtml(price[1])} — ${formatPrice(price[2])} €</li>`)
      else out.push(`<li>${escapeHtml(item)}</li>`)
    } else {
      closeList()
      out.push(`<p>${escapeHtml(line)}</p>`)
    }
  }
  closeList()
  return out.join('\n')
}

/** Emits dist/listino-prezzi/index.html as a real static HTML page built from public/llms.txt.
 * The site is a client-rendered SPA with no SSR, so every route is served by the Hosting rewrite
 * `** -> /index.html` and contains no prices until React runs. Firebase Hosting serves static
 * files before that rewrite, so this pre-rendered file wins at /listino-prezzi/ and gives
 * crawlers/AI fetchers (Googlebot, GPTBot, ChatGPT-User) a linkable, indexable page whose prices
 * are plain DOM text — still generated from the single source of truth, public/llms.txt. */
function emitListinoPage(): Plugin {
  return {
    name: 'emit-listino-page',
    generateBundle() {
      const path = resolve(process.cwd(), 'public/llms.txt')
      let llmsTxt: string
      try {
        llmsTxt = readFileSync(path, 'utf-8')
      } catch (err) {
        return this.error(`[emit-listino-page] cannot read ${path}: ${(err as Error).message}. It is the single source of truth for /listino-prezzi/ — build aborted instead of emitting an empty page.`)
      }
      if (!llmsTxt.trim()) {
        return this.error(`[emit-listino-page] ${path} is empty — refusing to emit an empty /listino-prezzi/ page. Regenerate it from the admin "SEO / GEO tools" page.`)
      }
      const today = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
      this.emitFile({
        type: 'asset',
        fileName: 'listino-prezzi/index.html',
        source: `<!doctype html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Listino prezzi | CNC Beauty Sciacca</title>
    <meta name="description" content="Listino prezzi aggiornato di CNC Beauty, centro estetico a Sciacca (AG): manicure e pedicure, semipermanente, ricostruzione unghie, epilazione laser, ceretta, massaggi e trattamenti viso e corpo." />
    <link rel="canonical" href="https://cncbeauty.it/listino-prezzi/" />
    <meta name="robots" content="index, follow" />
    <style>
      body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; }
      h2 { margin-top: 2rem; }
      h3 { margin-top: 1.5rem; }
      ul { padding-left: 1.25rem; }
    </style>
  </head>
  <body>
    <h1>Listino prezzi CNC Beauty Sciacca</h1>
    <p>Prezzi aggiornati al ${today}. Listino completo dei trattamenti e dei prodotti di CNC Beauty, centro estetico a Sciacca (AG).</p>
${renderListinoBody(llmsTxt)}
    <p><a href="/">Torna al sito CNC Beauty</a></p>
  </body>
</html>
`,
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), emitListinoPage()],
})
