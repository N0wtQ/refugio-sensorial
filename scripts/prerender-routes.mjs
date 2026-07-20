// Make every sitemap route return HTTP 200 on GitHub Pages.
//
// Pages only serves real files; without this, deep routes like
// /entender-y-prepararse/masking fall back to 404.html (SPA redirect) and
// respond with STATUS 404 — browsers recover via JS, but crawlers refuse
// to index a 404. Copying the app shell to <route>/index.html makes each
// route a real file (Pages 301s /ruta → /ruta/ and serves it with 200);
// React Router then renders the right page client-side.
//
// Runs after `vite build` (see package.json "build").

import { mkdir, readFile, copyFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const DIST = fileURLToPath(new URL('../dist/', import.meta.url))
const SITEMAP = fileURLToPath(new URL('../public/sitemap.xml', import.meta.url))

const xml = await readFile(SITEMAP, 'utf8')
const routes = [...xml.matchAll(/<loc>https:\/\/www\.refugio-sensorial\.com([^<]*)<\/loc>/g)]
  .map(m => m[1].replace(/\/+$/, ''))
  .filter(r => r && r !== '/')

let count = 0
for (const route of routes) {
  const dir = path.join(DIST, route)
  await mkdir(dir, { recursive: true })
  await copyFile(path.join(DIST, 'index.html'), path.join(dir, 'index.html'))
  count++
}
console.log(`Prerender: ${count} rutas con index.html propio (HTTP 200 en Pages)`)
