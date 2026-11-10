// Generates the 1200×630 social images in public/og/ (see src/lib/og/index.js).
// Run by hand when a title changes: node scripts/generate-og.mjs

import { mkdir, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import puppeteer from 'puppeteer-core'

const OUT = fileURLToPath(new URL('../public/og/', import.meta.url))
const LOGO = fileURLToPath(new URL('../public/logo-icon.svg', import.meta.url))

const CARDS = {
  'default.png':         ['Refugio Sensorial', 'Espacios seguros y herramientas reales para personas neurodivergentes'],
  'inicio.png':          ['Refugio Sensorial', 'Espacios seguros y herramientas reales para personas neurodivergentes'],
  'espacios.png':        ['Mapa de espacios silenciosos', 'Lugares tranquilos y accesibles para personas neurodivergentes'],
  'herramientas.png':    ['Herramientas digitales', 'Apps y recursos para TEA, TDAH, dislexia y TOC'],
  'entender.png':        ['Entender y prepararse', 'Meltdown, shutdown, señales y técnicas de regulación'],
  'estados.png':         ['Meltdown, shutdown y burnout', 'Qué son y cómo diferenciarlos'],
  'ayuda.png':           ['Necesito ayuda ahora', 'Apoyo inmediato y técnicas de regulación'],
  'estado-meltdown.png': ['Meltdown autista', 'Qué es, señales y qué ayuda'],
  'estado-shutdown.png': ['Shutdown autista', 'Qué es, señales y qué ayuda'],
  'estado-burnout.png':  ['Burnout autista', 'Qué es, señales y recuperación'],
  'perfil-autismo.png':  ['Herramientas para personas autistas', 'Regulación sensorial, comunicación y más'],
  'perfil-tdah.png':     ['Herramientas para TDAH', 'Tiempo, concentración y rutinas'],
  'perfil-dislexia.png': ['Herramientas para dislexia', 'Texto a voz, lectura y escritura'],
  'perfil-toc.png':      ['Herramientas para TOC y ansiedad', 'Regulación emocional y organización'],
}

const chrome = [
  process.env.CHROME_PATH,
  '/usr/bin/google-chrome',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(c => c && existsSync(c))

const logo = `data:image/svg+xml;base64,${(await readFile(LOGO)).toString('base64')}`
const card = (title, sub) => `<!doctype html><meta charset="utf-8"><style>
  body { margin: 0; width: 1200px; height: 630px; box-sizing: border-box; padding: 80px;
         background: #0C0E1E; color: #E5E7EB; font-family: Inter, 'Segoe UI', Arial, sans-serif;
         display: flex; flex-direction: column; justify-content: center; position: relative; }
  .bar { position: absolute; inset: 0 0 auto 0; height: 10px; background: linear-gradient(90deg, #3A82CA, #816AB7, #48B0A1); }
  img { width: 96px; height: 96px; margin-bottom: 40px; }
  h1 { font-size: 68px; line-height: 1.1; margin: 0 0 24px; font-weight: 700; }
  p { font-size: 34px; line-height: 1.3; margin: 0; color: #A5ACBD; }
  .site { position: absolute; left: 80px; bottom: 44px; font-size: 24px; color: #48B0A1; }
</style><div class="bar"></div><img src="${logo}" alt=""><h1>${title}</h1><p>${sub}</p>
<div class="site">refugio-sensorial.com</div>`

await mkdir(OUT, { recursive: true })
const browser = await puppeteer.launch({ executablePath: chrome, headless: true })
const tab = await browser.newPage()
await tab.setViewport({ width: 1200, height: 630 })
for (const [file, [title, sub]] of Object.entries(CARDS)) {
  await tab.setContent(card(title, sub), { waitUntil: 'load' })
  await tab.screenshot({ path: path.join(OUT, file) })
}
await browser.close()
console.log(`OG: ${Object.keys(CARDS).length} imágenes en public/og/`)
