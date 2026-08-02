/**
 * Herramientas dynamic landing.
 * Handles both /herramientas/:perfil (autismo, tdah, dislexia, toc)
 * and  /herramientas/:categoria (concentracion, regulacion, …).
 *
 * Falls back to 404 for unknown slugs.
 */

import { useMemo, useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams, Link, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { usePageMeta } from '../../hooks/usePageMeta'
import Breadcrumb from '../../components/ui/Breadcrumb'
import FavoriteButton from '../../components/ui/FavoriteButton'
import { logoSrc } from '../../lib/logos'
import {
  PERFILES_CONFIG,
  CATEGORIAS_CONFIG,
  getToolsByProfile,
  getToolsByCategory,
} from '../../lib/content-graph/index'

const PRECIO_BADGE = {
  Gratis:    'text-acc   bg-acc/10   border-acc/20',
  Freemium:  'text-pri   bg-pri/10   border-pri/20',
  Pago:      'text-coral bg-coral/10 border-coral/20',
}

const TIPO_BADGE = {
  APP:    'text-sec  bg-sec/10  border-sec/20',
  WEB:    'text-pri  bg-pri/10  border-pri/20',
  EXT:    'text-acc  bg-acc/10  border-acc/20',
  HARD:   'text-warm bg-warm/10 border-warm/20',
  TIENDA: 'text-coral bg-coral/10 border-coral/20',
  MARKETPLACE: 'text-coral bg-coral/10 border-coral/20',
}

// The whole card is a link when the tool has a destination URL — click anywhere to open it
function ToolCard({ h, index, categoryIcon }) {
  const prefersReduced = useReducedMotion()
  const [logoFailed, setLogoFailed] = useState(false)
  const Wrapper = h.enlace ? motion.a : motion.div
  const linkProps = h.enlace ? { href: h.enlace, target: '_blank', rel: 'noopener noreferrer' } : {}

  return (
    <Wrapper
      {...linkProps}
      initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: prefersReduced ? 0 : 0.35, delay: prefersReduced ? 0 : (index % 6) * 0.05 }}
      className="group flex flex-col gap-3 p-4 rounded-card border border-border bg-surface
                 hover:border-sec/30 hover:bg-surfaceH hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/20
                 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2
                 focus-visible:ring-pri focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      aria-label={h.enlace ? `${h.nombre} — ${h.notas} (se abre en nueva pestaña)` : undefined}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-sec/10 border border-sec/15 overflow-hidden">
            {!logoFailed ? (
              <img
                src={logoSrc(h.nombre)}
                alt=""
                width="24"
                height="24"
                loading="lazy"
                className="w-6 h-6 object-contain rounded"
                onError={() => setLogoFailed(true)}
                aria-hidden="true"
              />
            ) : (
              <i className={`fa-solid ${categoryIcon ?? 'fa-toolbox'} text-sec text-sm`} aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text leading-snug group-hover:text-sec transition-colors duration-200">
              {h.nombre}
            </p>
            <p className="text-[10px] text-muted mt-0.5">{h.subcategoria} · {h.plataforma}</p>
          </div>
        </div>
        <FavoriteButton
          type="herramienta"
          id={h.nombre}
          titulo={h.nombre}
          href="/herramientas"
          className="shrink-0"
        />
      </div>

      <p className="text-xs text-muted leading-relaxed flex-1">{h.notas}</p>

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Las tiendas de fidgets siempre son "Pago" — el badge no aporta info, se omite */}
          {h.categoria !== 'Dónde comprar fidgets sensoriales' && (
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${PRECIO_BADGE[h.precio] ?? 'text-faint bg-surface border-border'}`}>
              {h.precio}
            </span>
          )}
          {h.tipo && (
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${TIPO_BADGE[h.tipo] ?? 'text-faint bg-surface border-border'}`}>
              {h.tipo}
            </span>
          )}
        </div>
        {h.enlace && (
          <span className="text-[11px] font-semibold text-pri opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 flex items-center gap-1">
            Abrir
            <i className="fa-solid fa-arrow-up-right-from-square text-[9px]" aria-hidden="true" />
          </span>
        )}
      </div>
    </Wrapper>
  )
}

// ── Dropdown de país — solo en el directorio de fidgets ──────────────────────
function PaisDropdown({ value, options }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const triggerRef = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setOpen(false)
      triggerRef.current?.focus()
    }
  }

  const selectPais = (pais) => {
    const next = new URLSearchParams(searchParams)
    if (pais === 'todos') next.delete('pais'); else next.set('pais', pais)
    setSearchParams(next, { replace: true })
    setOpen(false)
  }

  const isFiltered = value !== 'todos'
  const current = options.find(([pais]) => pais === value)
  const label = isFiltered && current ? `${value} (${current[1]})` : 'Todos los países'

  return (
    <div ref={ref} className="relative" onKeyDown={handleKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex items-center gap-2 pl-3 pr-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors duration-200 ${
          isFiltered
            ? 'bg-sec/15 text-sec border-sec/30'
            : 'bg-surface text-muted border-border hover:text-text'
        }`}
      >
        <i className="fa-solid fa-earth-americas text-[11px]" aria-hidden="true" />
        {label}
        <i className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-150 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.13 }}
            className="absolute top-full left-0 mt-1.5 w-56 max-h-72 overflow-y-auto rounded-xl border border-border bg-[#0C0E1E] shadow-xl shadow-black/40 z-50 py-1"
            role="listbox"
            aria-label="Filtrar por país"
          >
            <button
              role="option"
              aria-selected={!isFiltered}
              onClick={() => selectPais('todos')}
              className={`w-full flex items-center justify-between px-4 py-2 text-xs transition-colors duration-150 hover:bg-white/5 ${
                !isFiltered ? 'text-text font-semibold' : 'text-muted'
              }`}
            >
              Todos los países
            </button>
            <div className="h-px bg-border/50 mx-3 my-0.5" aria-hidden="true" />
            {options.map(([pais, count]) => (
              <button
                key={pais}
                role="option"
                aria-selected={value === pais}
                onClick={() => selectPais(pais)}
                className={`w-full flex items-center justify-between px-4 py-2 text-xs transition-colors duration-150 hover:bg-white/5 ${
                  value === pais ? 'text-sec font-semibold' : 'text-muted'
                }`}
              >
                {pais}
                <span className="text-faint tabular-nums">{count}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function HerramientasLandingPage() {
  const { slug } = useParams()
  const { t } = useTranslation(['landing', 'pages', 'nav'])
  const [searchParams, setSearchParams] = useSearchParams()
  const prefersReduced = useReducedMotion()

  const perfil   = useMemo(() => PERFILES_CONFIG.find(p => p.slug === slug),    [slug])
  const categoria = useMemo(() => CATEGORIAS_CONFIG.find(c => c.slug === slug), [slug])
  const config    = perfil ?? categoria
  // Label/desc/SEO text are translated (landing.json, keyed by slug); the
  // rest of `config` (icon, color, filterKey, cats...) stays untranslated data.
  const kind = perfil ? 'perfiles' : categoria ? 'categorias' : null
  const configLabel = kind ? t(`landing:${kind}.${slug}.label`) : ''
  const configDesc  = kind ? t(`landing:${kind}.${slug}.desc`) : ''

  const todasLasTiendas = useMemo(() => {
    if (perfil)    return getToolsByProfile(slug)
    if (categoria) return getToolsByCategory(slug)
    return []
  }, [slug, perfil, categoria])

  // Filtro por tipo de producto (Squishies, Spinners, Putty...) — solo tiene
  // sentido en el directorio de tiendas de fidgets, ya que es el único donde
  // las herramientas llevan el campo "productos". Muchas tiendas de catálogo
  // amplio (Therapy Shoppe, marketplaces...) no lo llevan porque no hay forma
  // de verificar en este entorno qué venden exactamente — esas solo aparecen
  // con el filtro "Todos".
  const productosDisponibles = useMemo(() => {
    if (slug !== 'tiendas-fidgets') return []
    const counts = new Map()
    for (const h of todasLasTiendas) {
      if (!h.productos) continue
      for (const p of h.productos.split(',').map(s => s.trim()).filter(Boolean)) {
        counts.set(p, (counts.get(p) ?? 0) + 1)
      }
    }
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [slug, todasLasTiendas])

  // Filtro por país — igual de restringido: solo se etiquetan tiendas cuyo
  // país aparece ya documentado (fabricante estadounidense, tienda española...);
  // las que no tienen país confirmado (Lautie, ONO Roller, Kaiko,
  // ADHS Store, Cuboss, Fidget Toys Plus...) se quedan sin país y solo
  // aparecen con el filtro "Todos los países".
  const paisesDisponibles = useMemo(() => {
    if (slug !== 'tiendas-fidgets') return []
    const counts = new Map()
    for (const h of todasLasTiendas) {
      if (!h.pais) continue
      counts.set(h.pais, (counts.get(h.pais) ?? 0) + 1)
    }
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [slug, todasLasTiendas])

  const productoFilter = searchParams.get('producto') ?? 'todos'
  const paisFilter     = searchParams.get('pais') ?? 'todos'
  const hayFiltroActivo = productoFilter !== 'todos' || paisFilter !== 'todos'
  // Los filtros empiezan plegados para no saturar la vista inicial — salvo que
  // ya venga un filtro activo por la URL (p. ej. un enlace compartido).
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(() => hayFiltroActivo)

  const herramientas = useMemo(() => {
    if (slug !== 'tiendas-fidgets') return todasLasTiendas
    return todasLasTiendas.filter(h => {
      const matchProducto = productoFilter === 'todos' ||
        h.productos?.split(',').map(s => s.trim()).includes(productoFilter)
      const matchPais = paisFilter === 'todos' || h.pais === paisFilter
      return matchProducto && matchPais
    })
  }, [todasLasTiendas, slug, productoFilter, paisFilter])

  const handleProductoClick = (producto) => {
    const next = new URLSearchParams(searchParams)
    if (searchParams.get('producto') === producto) next.delete('producto')
    else next.set('producto', producto)
    setSearchParams(next, { replace: true })
  }

  usePageMeta({
    title:       kind ? t(`landing:${kind}.${slug}.seoTitle`) : `Herramientas · ${slug} — Refugio Sensorial`,
    description: kind ? t(`landing:${kind}.${slug}.seoDescription`) : '',
    section:     'herramientas',
  })

  if (!config) return <Navigate to="/herramientas" replace />

  const breadcrumbItems = [
    { href: '/',             label: t('pages:breadcrumbHome') },
    { href: '/herramientas', label: t('nav:links.herramientas.label') },
    {                        label: configLabel },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <Breadcrumb items={breadcrumbItems} className="mb-8" />

      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${config.color} bg-current/10`}>
            <i className={`fa-solid ${config.icon} ${config.color} text-lg`} aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text leading-tight">{configLabel}</h1>
            <p className="text-sm text-muted mt-1 max-w-2xl leading-relaxed">{configDesc}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-faint">
            {t('landing:toolCount', { count: herramientas.length })}
          </span>
          <span aria-hidden="true" className="text-border">·</span>
          <Link
            to="/herramientas"
            className="text-xs text-faint hover:text-text transition-colors duration-150 flex items-center gap-1"
          >
            <i className="fa-solid fa-arrow-left text-[10px]" aria-hidden="true" />
            {t('landing:seeAll')}
          </Link>
        </div>
      </div>

      {/* Filter pills — other profiles */}
      {perfil && (
        <nav aria-label={t('landing:otherProfiles')} className="flex flex-wrap gap-2 mb-8">
          {PERFILES_CONFIG.filter(p => p.slug !== slug).map(p => (
            <Link
              key={p.slug}
              to={`/herramientas/${p.slug}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface text-xs text-faint
                         hover:border-sec/30 hover:text-text transition-all duration-150"
            >
              <i className={`fa-solid ${p.icon} ${p.color} text-[10px]`} aria-hidden="true" />
              {p.label}
            </Link>
          ))}
        </nav>
      )}

      {/* Filtros — plegados por defecto para no saturar la vista. La barra
          queda fija bajo la cabecera al hacer scroll, para no tener que
          volver arriba para cambiarlos en una lista larga. */}
      {(paisesDisponibles.length > 0 || productosDisponibles.length > 0) && (
        <div className="sticky top-[72px] z-30 -mx-4 px-4 bg-bg/95 backdrop-blur-sm mb-8 pb-3">
          <button
            type="button"
            onClick={() => setFiltrosAbiertos(o => !o)}
            aria-expanded={filtrosAbiertos}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors duration-200 ${
              hayFiltroActivo
                ? 'bg-sec/15 text-sec border-sec/30'
                : 'bg-surface text-muted border-border hover:text-text'
            }`}
          >
            <i className="fa-solid fa-sliders text-[11px]" aria-hidden="true" />
            Filtros
            {hayFiltroActivo && <span className="w-1.5 h-1.5 rounded-full bg-sec" aria-hidden="true" />}
            <i className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-150 ${filtrosAbiertos ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>

          <AnimatePresence initial={false}>
            {filtrosAbiertos && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                {/* País y tipo de producto en la misma fila */}
                <div className="flex flex-wrap items-center gap-2 mt-4" role="group" aria-label="Filtrar por país y tipo de producto">
                  {paisesDisponibles.length > 0 && (
                    <PaisDropdown value={paisFilter} options={paisesDisponibles} />
                  )}
                  {productosDisponibles.length > 0 && (
                    <>
                      <button
                        onClick={() => {
                          const next = new URLSearchParams(searchParams)
                          next.delete('producto')
                          setSearchParams(next, { replace: true })
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors duration-200 ${
                          productoFilter === 'todos'
                            ? 'bg-sec/15 text-sec border-sec/30'
                            : 'bg-surface text-muted border-border hover:text-text hover:border-border/80'
                        }`}
                        aria-pressed={productoFilter === 'todos'}
                      >
                        Todos ({todasLasTiendas.length})
                      </button>
                      {productosDisponibles.map(([producto, count]) => (
                        <button
                          key={producto}
                          onClick={() => handleProductoClick(producto)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors duration-200 ${
                            productoFilter === producto
                              ? 'bg-sec/15 text-sec border-sec/30 ring-1 ring-sec/40 ring-inset'
                              : 'bg-surface text-muted border-border hover:text-text hover:border-border/80'
                          }`}
                          aria-pressed={productoFilter === producto}
                        >
                          {producto} ({count})
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Grid */}
      {herramientas.length > 0 ? (
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3"
          aria-label={`${herramientas.length} herramientas para ${config.label}`}
        >
          {herramientas.map((h, i) => (
            <ToolCard key={h.nombre} h={h} index={i} categoryIcon={config.icon} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-muted text-sm">No se encontraron herramientas para este filtro.</p>
          <Link to="/herramientas" className="mt-4 inline-block text-sm text-pri hover:underline">
            Ver todas las herramientas
          </Link>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-12 flex flex-col sm:flex-row gap-3">
        <Link
          to="/herramientas"
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-surface border border-border
                     text-sm font-semibold text-muted hover:border-sec/30 hover:text-text transition-all duration-200"
        >
          <i className="fa-solid fa-grid-2 text-sec text-xs" aria-hidden="true" />
          Ver todas las herramientas
        </Link>
        <Link
          to="/entender-y-prepararse/tecnicas"
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-surface border border-border
                     text-sm font-semibold text-muted hover:border-acc/30 hover:text-text transition-all duration-200"
        >
          <i className="fa-solid fa-heart-pulse text-acc text-xs" aria-hidden="true" />
          Técnicas de regulación
        </Link>
      </div>
    </div>
  )
}
