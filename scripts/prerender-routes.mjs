// Write real HTML for every sitemap route so crawlers and social networks get
// each page's own content without running JavaScript.
//
// Pages only serves real files: without <route>/index.html a deep route falls
// back to 404.html and responds with STATUS 404. So each route is rendered in
// headless Chrome and its result is saved as a file. React then takes over in
// the browser (see src/main.jsx).
//
// Runs after `vite build` (see package.json "build"). Fails the build rather
// than publishing an empty page.

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import puppeteer from 'puppeteer-core'
import { preview } from 'vite'

const DIST = fileURLToPath(new URL('../dist/', import.meta.url))
const SITEMAP = fileURLToPath(new URL('../public/sitemap.xml', import.meta.url))
const PORT = 4179

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ]
  const found = candidates.find(c => c && existsSync(c))
  if (!found) throw new Error('Prerender: no se encontró Chrome. Define CHROME_PATH.')
  return found
}

const escapeAttr = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const escapeText = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

// Runs in the page: reduces the live DOM to what should ship as static HTML.
function snapshot() {
  const root = document.getElementById('root')
  root.querySelectorAll('canvas').forEach(el => el.remove())
  root.querySelectorAll('.leaflet-container').forEach(el => { el.innerHTML = '' })
  // Crawlers should not pay a 301 on every internal link
  root.querySelectorAll('a[href^="/"]').forEach(a => {
    const href = a.getAttribute('href')
    if (!/[.#?]/.test(href) && !href.endsWith('/')) a.setAttribute('href', `${href}/`)
  })
  // Anything still waiting on a scroll reveal must be visible without JS
  root.querySelectorAll('[style*="opacity"], [style*="transform"]').forEach(el => {
    el.style.opacity = ''
    el.style.transform = ''
  })

  const metas = [...document.head.querySelectorAll(
    'meta[name="description"], meta[name="robots"], meta[property^="og:"], meta[name^="twitter:"]'
  )].map(el => ({
    key: el.hasAttribute('property') ? 'property' : 'name',
    name: el.getAttribute('property') ?? el.getAttribute('name'),
    content: el.getAttribute('content') ?? '',
  }))

  return {
    title: document.title,
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '',
    metas,
    jsonLd: [...document.head.querySelectorAll('script[id^="jsonld-"]')]
      .map(el => ({ id: el.id, json: el.textContent })),
    h1: root.querySelector('h1')?.textContent.trim() ?? '',
    html: root.innerHTML,
  }
}

function renderHtml(template, page) {
  const head = [
    `<title>${escapeText(page.title)}</title>`,
    `<link rel="canonical" href="${escapeAttr(page.canonical)}" />`,
    ...page.metas.map(m => `<meta ${m.key}="${m.name}" content="${escapeAttr(m.content)}" />`),
    // "<" must not appear literally inside a script block
    ...page.jsonLd.map(s => `<script type="application/ld+json" id="${s.id}">${s.json.replace(/</g, '\\u003c')}</script>`),
  ].join('\n  ')

  return template
    .replace(/<meta\s+(?:name="(?:description|robots)"|property="og:[^"]*"|name="twitter:[^"]*")[^>]*>\s*/g, '')
    .replace(/<title>[^<]*<\/title>/, () => head)
    .replace('<div id="root"></div>', () => `<div id="root">${page.html}</div>`)
}

const xml = await readFile(SITEMAP, 'utf8')
const routes = [...xml.matchAll(/<loc>https:\/\/www\.refugio-sensorial\.com([^<]*)<\/loc>/g)]
  .map(m => m[1].replace(/\/+$/, '') || '/')

const template = await readFile(path.join(DIST, 'index.html'), 'utf8')
const server = await preview({ preview: { port: PORT, strictPort: true }, logLevel: 'silent' })
const browser = await puppeteer.launch({
  executablePath: findChrome(),
  headless: true,
  args: ['--no-sandbox', '--lang=es-ES'],
})

const pages = new Map()
try {
  for (const route of routes) {
    const tab = await browser.newPage()
    await tab.setViewport({ width: 1280, height: 900 })
    await tab.evaluateOnNewDocument(() => localStorage.setItem('refugio-sensorial-lang', 'es'))
    await tab.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'domcontentloaded' })
    await tab.waitForSelector('#main-content h1', { timeout: 20000 })
    // Let entrance animations and scroll reveals settle, then return to the top
    await tab.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await new Promise(r => setTimeout(r, 900))
    await tab.evaluate(() => window.scrollTo(0, 0))
    const page = await tab.evaluate(snapshot)
    await tab.close()

    if (!page.h1 || !page.canonical) throw new Error(`Prerender: ${route} sin H1 o canonical`)
    pages.set(route, page)
  }
} finally {
  await browser.close()
  await new Promise(r => server.httpServer.close(r))
}

for (const [route, page] of pages) {
  const dir = path.join(DIST, route)
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, 'index.html'), renderHtml(template, page))
}
console.log(`Prerender: ${pages.size} rutas con HTML propio`)
process.exit(0)
