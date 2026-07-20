// Schema.org builders shared by content pages.
// datePublished is intentionally omitted: fabricated dates hurt more than
// their absence. Add real ones if publication dates start being tracked.

const SITE_URL = 'https://www.refugio-sensorial.com'

export function articleLd({ titulo, descripcion, ruta }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: titulo,
    description: descripcion,
    inLanguage: 'es-ES',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${ruta}` },
    author: { '@type': 'Person', name: 'Almudena Bedoya' },
    publisher: {
      '@type': 'Organization',
      name: 'Refugio Sensorial',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo-icon.png` },
    },
    image: `${SITE_URL}/logo-icon.png`,
  }
}
