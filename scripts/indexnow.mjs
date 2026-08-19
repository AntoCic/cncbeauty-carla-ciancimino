/** Notifies IndexNow (Bing, Yandex, Seznam, Naver) that the site's URLs changed.
 * The site is a client-rendered SPA whose price pages are useless until they're in a
 * search index — waiting for an organic crawl takes weeks, this takes hours. Runs as
 * npm "postdeploy"; the URL list comes from public/sitemap.xml so there is nothing to
 * keep in sync by hand. Can also be run on its own: `npm run indexnow`. */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KEY = 'a4eb5d99236d15e1544ebba2c744dd77';
const HOST = 'cncbeauty.it';
const ENDPOINT = 'https://api.indexnow.org/IndexNow';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** Il ping e' best-effort, la pubblicazione no: se questo script uscisse non-zero,
 * il menu `npm run home` marcherebbe come fallito un deploy in realta' riuscito
 * (legge il codice di uscita di `npm run deploy`, di cui questo e' il postdeploy).
 * Quindi l'errore si vede forte a schermo ma l'uscita resta 0 — e senza
 * process.exit(), che su pipe puo' troncare proprio il messaggio d'errore. */
function warnDeployStillOk(msg) {
  console.error('');
  console.error("  ATTENZIONE: il sito E' stato pubblicato correttamente,");
  console.error("  ma la notifica IndexNow ai motori di ricerca e' FALLITA.");
  console.error(`  Motivo: ${msg}`);
  console.error('  Riprova quando vuoi con:');
  console.error('    npm --prefix cncbeauty-carla-ciancimino run indexnow');
  console.error('');
}

async function main() {
  let sitemap;
  try {
    sitemap = readFileSync(resolve(root, 'public/sitemap.xml'), 'utf-8');
  } catch (e) {
    return warnDeployStillOk(`impossibile leggere public/sitemap.xml: ${e.message}`);
  }

  const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (urlList.length === 0) return warnDeployStillOk('nessun <loc> trovato in public/sitemap.xml');

  console.log(`[indexnow] invio ${urlList.length} URL a ${ENDPOINT}:`);
  for (const u of urlList) console.log(`  - ${u}`);

  let res;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
    });
  } catch (e) {
    return warnDeployStillOk(`richiesta fallita: ${e.message}`);
  }

  // 200 = accettato; 202 = accettato, chiave ancora da verificare (normale al primo invio).
  if (res.status === 200 || res.status === 202) {
    console.log(`[indexnow] OK (HTTP ${res.status}) — Bing e gli altri motori sono stati notificati.`);
    return;
  }
  const text = await res.text().catch(() => '');
  warnDeployStillOk(`IndexNow ha risposto HTTP ${res.status}. ${text}`.trim());
}

await main();
