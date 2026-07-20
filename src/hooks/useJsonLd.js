import { useEffect } from 'react'

/**
 * Injects a JSON-LD <script> into <head> for the current page.
 * Cleans up on unmount so scripts don't stack across navigations.
 *
 * Each `slot` owns its own <script> element, so a page can carry several
 * independent blocks (e.g. BreadcrumbList + Article) without clobbering
 * each other.
 *
 * @param {object|null} data — Schema.org object (e.g. BreadcrumbList, Article)
 * @param {string} [slot] — unique key per JSON-LD block on the page
 */
export function useJsonLd(data, slot = 'page') {
  const json = data ? JSON.stringify(data) : null
  const scriptId = `jsonld-${slot}`

  useEffect(() => {
    if (!json) {
      document.getElementById(scriptId)?.remove()
      return
    }
    let el = document.getElementById(scriptId)
    if (!el) {
      el = document.createElement('script')
      el.setAttribute('type', 'application/ld+json')
      el.setAttribute('id', scriptId)
      document.head.appendChild(el)
    }
    el.textContent = json
    return () => {
      document.getElementById(scriptId)?.remove()
    }
  }, [json, scriptId])
}
