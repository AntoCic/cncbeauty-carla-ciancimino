import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/** Injects public/llms.txt as visible <noscript> text into index.html at build/dev time.
 * The site is a client-rendered SPA, so crawlers/AI fetchers that don't execute JS (and that
 * also strip <script type="application/ld+json"> content, as most do) otherwise see no price
 * data at all — this puts the same listino directly in the raw HTML they do read, without
 * duplicating it by hand (single source of truth stays public/llms.txt). */
function injectLlmsTxtNoscript(): Plugin {
  return {
    name: 'inject-llms-txt-noscript',
    transformIndexHtml(html) {
      const llmsTxt = readFileSync(resolve(process.cwd(), 'public/llms.txt'), 'utf-8')
      const escaped = llmsTxt.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      return html.replace('<div id="root"></div>', `<noscript><pre>${escaped}</pre></noscript>\n    <div id="root"></div>`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), injectLlmsTxtNoscript()],
})
