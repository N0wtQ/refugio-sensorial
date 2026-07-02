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

export function logoSrc(nombre) {
  return `${import.meta.env.BASE_URL}logos/${slugify(nombre)}.png`
}
