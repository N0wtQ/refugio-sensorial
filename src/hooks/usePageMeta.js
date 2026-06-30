/**
 * usePageMeta — sets document.title, meta description, canonical,
 * Open Graph and Twitter Card tags on mount.
 *
 * @param {{ title: string, description: string, canonical?: string,
 *           ogImage?: string, ogImageAlt?: string,
 *           ogType?: string, section?: string,
 *           noIndex?: boolean }} opts
 */

import { useEffect } from 'react'
import { getOgImage } from '../lib/og/index'

const BASE_URL = `https://www.refugio-sensorial.com`

function sanitizeText(str) {
  return typeof str === 'string' ? str.replace(/[<>"'&]/g, '') : ''
}

function sanitizeUrl(str) {
  if (typeof str !== 'string') return ''
  const trimmed = str.trim()
  // Only allow https:// and relative URLs starting with /
  if (/^https:\/\//i.test(trimmed) || /^\//.test(trimmed)) return trimmed
  return ''
}

export function usePageMeta({
  title,
  description,
  canonical,
  ogImage,
  ogImageAlt,
  ogType = 'website',
  section,
  noIndex = false,
}) {
  useEffect(() => {
    const safeTitle = sanitizeText(title)
    const safeDesc = sanitizeText(description)

    // ── title ──────────────────────────────────────────────────────────────
    const prevTitle = document.title
    document.title = safeTitle

    // ── description ────────────────────────────────────────────────────────
    const metaDesc = document.querySelector('meta[name="description"]')
    const prevDesc = metaDesc?.getAttribute('content') ?? ''
    metaDesc?.setAttribute('content', safeDesc)

    // ── canonical ──────────────────────────────────────────────────────────
    const rawCanonical = canonical ?? `${BASE_URL}${window.location.pathname}`
    const canonicalUrl = sanitizeUrl(rawCanonical) || `${BASE_URL}/`

    let canonicalEl = document.querySelector('link[rel="canonical"]')
    if (!canonicalEl) {
      canonicalEl = document.createElement('link')
      canonicalEl.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalEl)
    }
    const prevCanonical = canonicalEl.getAttribute('href') ?? ''
    canonicalEl.setAttribute('href', canonicalUrl)

    // ── robots meta (noindex for 404, search result pages, etc.) ──────────
    let robotsEl = document.querySelector('meta[name="robots"]')
    const prevRobots = robotsEl?.getAttribute('content') ?? ''
    if (noIndex) {
      if (!robotsEl) {
        robotsEl = document.createElement('meta')
        robotsEl.setAttribute('name', 'robots')
        document.head.appendChild(robotsEl)
      }
      robotsEl.setAttribute('content', 'noindex, nofollow')
    }

    // ── Open Graph ────────────────────────────────────────────────────────
    const resolvedOgImage = ogImage ?? getOgImage(section)
    const resolvedOgImageAlt = sanitizeText(ogImageAlt ?? title)
    const ogData = {
      'og:title':       safeTitle,
      'og:description': safeDesc,
      'og:type':        ogType,
      'og:url':         canonicalUrl,
      'og:image':       resolvedOgImage,
      'og:image:alt':   resolvedOgImageAlt,
      'og:locale':      'es_ES',
      'og:site_name':   'Refugio Sensorial',
    }
    const prevOg = {}
    for (const [prop, content] of Object.entries(ogData)) {
      let el = document.querySelector(`meta[property="${prop}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute('property', prop)
        document.head.appendChild(el)
      }
      prevOg[prop] = el.getAttribute('content') ?? ''
      el.setAttribute('content', content)
    }

    // ── Twitter Cards ─────────────────────────────────────────────────────
    const twitterData = {
      'twitter:card':        'summary_large_image',
      'twitter:title':       safeTitle,
      'twitter:description': safeDesc,
      'twitter:image':       resolvedOgImage,
      'twitter:image:alt':   resolvedOgImageAlt,
    }
    const prevTwitter = {}
    for (const [name, content] of Object.entries(twitterData)) {
      let el = document.querySelector(`meta[name="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute('name', name)
        document.head.appendChild(el)
      }
      prevTwitter[name] = el.getAttribute('content') ?? ''
      el.setAttribute('content', content)
    }

    return () => {
      document.title = prevTitle
      metaDesc?.setAttribute('content', prevDesc)
      canonicalEl.setAttribute('href', prevCanonical)
      if (noIndex && robotsEl) robotsEl.setAttribute('content', prevRobots)
      for (const [prop, prev] of Object.entries(prevOg)) {
        document.querySelector(`meta[property="${prop}"]`)?.setAttribute('content', prev)
      }
      for (const [name, prev] of Object.entries(prevTwitter)) {
        document.querySelector(`meta[name="${name}"]`)?.setAttribute('content', prev)
      }
    }
  }, [title, description, canonical, ogImage, ogImageAlt, ogType, section, noIndex])
}
