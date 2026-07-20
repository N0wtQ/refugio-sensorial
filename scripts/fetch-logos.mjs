// Fetch tool logos (favicons) at build time into public/logos/<slug>.png.
// Runs in CI before `vite build` — the output ships as first-party assets,
// so visitors never hit third-party favicon services and the CSP stays 'self'.
//
// Individual failures are tolerated: the UI falls back to the category icon
// for any missing logo. This script always exits 0.

import { mkdir, writeFile } from 'node:fs/promises'
import { herramientas } from '../src/data/herramientas.js'
import { slugify } from '../src/lib/logos.js'

const OUT_DIR = new URL('../public/logos/', import.meta.url)
const FAVICON = (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
const TIMEOUT_MS = 10_000
const CONCURRENCY = 8

// Store pages whose favicon would be the store's logo, not the tool's.
const STORE_HOSTS = ['play.google.com', 'apps.apple.com', 'chromewebstore.google.com']

// Official domains for tools whose enlace points to an app store.
// Tools linked to a store WITHOUT an override here are skipped (icon fallback).
const DOMAIN_OVERRIDES = {
  'Finch': 'finchcare.com',
  'Rootd': 'rootd.io',
  'Woebot': 'woebothealth.com',
  'Smiling Mind': 'smilingmind.com.au',
  'Balance': 'balanceapp.com',
  'Petit Bambú': 'petitbambou.com',
  'Insight Timer': 'insighttimer.com',
  'Bionic Reading': 'bionic-reading.com',
  'Speechify': 'speechify.com',
  'Constant Therapy': 'constanttherapy.com',
  'Otter.ai': 'otter.ai',
  'Omi AI': 'omi.me',
  'Dytective': 'changedyslexia.org',
  'PictogramAgenda': 'pictogramagenda.es',
}

function domainFor(tool) {
  if (DOMAIN_OVERRIDES[tool.nombre]) return DOMAIN_OVERRIDES[tool.nombre]
  try {
    const host = new URL(tool.enlace).hostname
    if (STORE_HOSTS.some(s => host === s || host.endsWith(`.${s}`))) return null
    return host
  } catch {
    return null
  }
}

async function fetchLogo(tool) {
  const domain = domainFor(tool)
  if (!domain) return { tool: tool.nombre, status: 'skipped (store link, no override)' }
  try {
    const res = await fetch(FAVICON(domain), { signal: AbortSignal.timeout(TIMEOUT_MS) })
    if (!res.ok) return { tool: tool.nombre, status: `failed (HTTP ${res.status})` }
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 100) return { tool: tool.nombre, status: 'failed (empty response)' }
    await writeFile(new URL(`${slugify(tool.nombre)}.png`, OUT_DIR), buf)
    return { tool: tool.nombre, status: 'ok' }
  } catch (err) {
    return { tool: tool.nombre, status: `failed (${err.name})` }
  }
}

await mkdir(OUT_DIR, { recursive: true })

const queue = [...herramientas]
const results = []
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    let tool
    while ((tool = queue.shift())) results.push(await fetchLogo(tool))
  })
)

const ok = results.filter(r => r.status === 'ok').length
for (const r of results.filter(r => r.status !== 'ok')) {
  console.warn(`  · ${r.tool}: ${r.status}`)
}
console.log(`Logos: ${ok}/${herramientas.length} descargados en public/logos/`)
