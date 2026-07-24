import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Breadcrumb from '../components/ui/Breadcrumb'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { RECURSOS_PDF } from '../data/recursos-pdf'
import TTSButton from '../components/ui/TTSButton'
import { usePageMeta } from '../hooks/usePageMeta'

const BASE_URL = import.meta.env.BASE_URL

// Unique categories preserving first-seen order
const CATEGORIAS = [...new Set(RECURSOS_PDF.map(p => p.categoria))]
// Color per category (from first document in that category)
const CAT_COLOR = Object.fromEntries(RECURSOS_PDF.map(p => [p.categoria, p.color]))

function PDFCard({ pdf, prefersReduced, index }) {
  const { t } = useTranslation('recursos')
  const href = pdf.url ?? `${BASE_URL}docs/${pdf.archivo}`
  const tts = t(`ttsPorPdf.${pdf.id}`, { defaultValue: '' })
  return (
    <motion.div
      initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: prefersReduced ? 0 : 0.4, delay: prefersReduced ? 0 : index * 0.08 }}
      className="flex items-start gap-4 p-5 rounded-card border border-border bg-surface"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm shrink-0 mt-0.5"
        style={{ background: `${pdf.color}18`, color: pdf.color }}
      >
        <i className={`fa-solid ${pdf.icono ?? 'fa-file-pdf'} text-base`} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-text leading-snug hover:text-pri transition-colors duration-200 group"
          >
            {pdf.titulo}
            <i
              className={`fa-solid ${pdf.url ? 'fa-arrow-up-right-from-square' : 'fa-arrow-down-to-line'} text-[10px] ml-1.5 text-muted group-hover:text-pri transition-colors duration-200`}
              aria-hidden="true"
            />
          </a>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-md border shrink-0"
            style={{ background: `${pdf.color}12`, color: pdf.color, borderColor: `${pdf.color}30` }}
          >
            {pdf.categoria}
          </span>
        </div>
        {pdf.descripcion && (
          <p className="text-xs text-muted leading-relaxed mb-3">{pdf.descripcion}</p>
        )}
        {tts && <TTSButton text={tts} />}
      </div>
    </motion.div>
  )
}

export default function RecursosPage() {
  const { t } = useTranslation(['recursos', 'pages'])
  usePageMeta({
    title: t('recursos:meta.title'),
    description: t('recursos:meta.description'),
  })
  const prefersReduced = useReducedMotion()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(() => searchParams.get('q') ?? '')
  const catFilter = searchParams.get('cat') ?? 'todas'

  const results = useMemo(() => {
    const q = search.toLowerCase().trim()
    return RECURSOS_PDF.filter(pdf => {
      const matchCat = catFilter === 'todas' || pdf.categoria === catFilter
      const matchSearch = !q ||
        pdf.titulo.toLowerCase().includes(q) ||
        pdf.descripcion?.toLowerCase().includes(q) ||
        pdf.categoria.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [search, catFilter])

  function updateSearch(val) {
    setSearch(val)
    const next = new URLSearchParams(searchParams)
    if (val) next.set('q', val); else next.delete('q')
    setSearchParams(next, { replace: true })
  }

  function updateCat(cat) {
    const next = new URLSearchParams(searchParams)
    if (cat === 'todas') next.delete('cat'); else next.set('cat', cat)
    setSearchParams(next, { replace: true })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pb-20 pt-8">
      <Breadcrumb items={[
        { href: '/', label: t('pages:breadcrumbHome') },
        { href: '/entender-y-prepararse', label: t('pages:entenderPrepararse.breadcrumb') },
        { label: t('recursos:breadcrumb') },
      ]} />

      <motion.div
        initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReduced ? 0 : 0.4 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-pri/10 flex items-center justify-center text-pri shrink-0">
            <i className="fa-solid fa-folder-open" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text leading-tight">{t('recursos:heading')}</h1>
            <p className="text-sm text-muted">{t('recursos:sub')}</p>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative mb-4">
        <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-faint text-sm pointer-events-none" aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={e => updateSearch(e.target.value)}
          placeholder={t('recursos:searchPlaceholder')}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-surface border border-border text-text text-sm placeholder:text-faint outline-none focus:border-pri/50 focus:ring-1 focus:ring-pri/30 transition-colors duration-200"
          aria-label={t('recursos:searchAriaLabel')}
        />
        {search && (
          <button
            onClick={() => updateSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-text transition-colors"
            aria-label={t('recursos:clearSearchAriaLabel')}
          >
            <i className="fa-solid fa-xmark text-sm" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label={t('recursos:catFilterAriaLabel')}>
        <button
          onClick={() => updateCat('todas')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors duration-200 ${
            catFilter === 'todas'
              ? 'bg-white/10 text-text border-white/20'
              : 'bg-surface text-muted border-border hover:text-text'
          }`}
          aria-pressed={catFilter === 'todas'}
        >
          {t('recursos:todas')} ({RECURSOS_PDF.length})
        </button>
        {CATEGORIAS.map(cat => {
          const active = catFilter === cat
          const color = CAT_COLOR[cat]
          return (
            <button
              key={cat}
              onClick={() => updateCat(active ? 'todas' : cat)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors duration-200 ${active ? 'ring-1 ring-inset ring-current/40' : ''}`}
              style={active
                ? { background: `${color}18`, color, borderColor: `${color}45` }
                : { background: 'rgba(19,21,43,1)', color: '#9CA3AF', borderColor: 'rgba(129,106,183,0.1)' }
              }
              aria-pressed={active}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Result count */}
      <p className="text-xs text-faint mb-4" aria-live="polite" aria-atomic="true">
        {results.length === RECURSOS_PDF.length
          ? <><strong className="text-muted">{results.length}</strong> {t('recursos:documentosLabel')}</>
          : <><strong className="text-text">{results.length}</strong> {t('recursos:resultadoLabel', { count: results.length })}</>
        }
      </p>

      {results.length > 0 ? (
        <div className="space-y-3">
          {results.map((pdf, i) => (
            <PDFCard key={pdf.id} pdf={pdf} prefersReduced={prefersReduced} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-14 rounded-card border border-border bg-surface">
          <i className="fa-solid fa-magnifying-glass text-3xl text-faint mb-4 block" aria-hidden="true" />
          <p className="text-muted text-sm font-medium mb-1">{t('recursos:emptyState.title')}</p>
          <p className="text-faint text-xs mb-5">{t('recursos:emptyState.sub')}</p>
          <button
            onClick={() => { updateSearch(''); updateCat('todas') }}
            className="px-4 py-2 rounded-lg bg-pri/10 text-pri text-xs font-semibold border border-pri/25 hover:bg-pri/18 transition-colors duration-200"
          >
            {t('recursos:emptyState.cta')}
          </button>
        </div>
      )}

      <nav aria-label={t('recursos:continueAriaLabel')} className="grid sm:grid-cols-2 gap-3 mt-10">
        {[
          {
            to: '/entender-y-prepararse/estados',
            icon: 'fa-brain',
            color: 'text-coral',
            bg: 'bg-coral/10',
            border: 'border-coral/25',
            bgCard: 'bg-coral/5',
            label: t('recursos:links.estados.label'),
            desc: t('recursos:links.estados.desc'),
          },
          {
            to: '/entender-y-prepararse/tecnicas',
            icon: 'fa-heart-pulse',
            color: 'text-acc',
            bg: 'bg-acc/10',
            border: 'border-acc/25',
            bgCard: 'bg-acc/5',
            label: t('recursos:links.tecnicas.label'),
            desc: t('recursos:links.tecnicas.desc'),
          },
        ].map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`group flex items-start gap-3 p-4 rounded-card border ${link.border} ${link.bgCard} hover:shadow-md hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pri focus-visible:ring-offset-2 focus-visible:ring-offset-bg`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${link.bg} ${link.color}`}>
              <i className={`fa-solid ${link.icon} text-sm`} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-semibold ${link.color} leading-snug mb-0.5`}>{link.label}</p>
              <p className="text-xs text-muted leading-relaxed">{link.desc}</p>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  )
}
