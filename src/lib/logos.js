// Tool logo helpers.
// Logos are fetched at build time by scripts/fetch-logos.mjs into public/logos/
// and served as first-party assets (/logos/<slug>.png). If a logo is missing,
// the UI falls back to the category icon.

// Pure — also imported by the Node fetch script, keep it free of Vite globals.
export function slugify(nombre) {
  return nombre
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Tools whose logo can't be auto-fetched from a domain favicon (e.g. an
// Instagram-only shop with no website) get a hand-placed file under
// public/logos-manual/ instead — that folder is git-tracked, unlike
// public/logos/ which is regenerated (and gitignored) on every build.
export const MANUAL_LOGOS = {
  'MundoDIVERgente': 'logos-manual/mundodivergente.png',
}

export function logoSrc(nombre) {
  const manual = MANUAL_LOGOS[nombre]
  if (manual) return `${import.meta.env.BASE_URL}${manual}`
  return `${import.meta.env.BASE_URL}logos/${slugify(nombre)}.png`
}
