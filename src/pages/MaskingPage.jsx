import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { usePageMeta } from '../hooks/usePageMeta'
import { useJsonLd } from '../hooks/useJsonLd'
import { articleLd } from '../lib/seo'
import Breadcrumb from '../components/ui/Breadcrumb'
import TTSButton from '../components/ui/TTSButton'

// Presentational metadata only — titulo/desc/tts/mito/realidad come from the
// 'masking' i18n namespace as parallel arrays, matched here by index.
const RAZONES_ICONS = ['fa-people-group', 'fa-heart-crack', 'fa-user-slash', 'fa-briefcase', 'fa-house-user', 'fa-clock-rotate-left']
const EJEMPLOS_ICONS = ['fa-eye', 'fa-face-smile', 'fa-comment-dots', 'fa-hand', 'fa-face-meh', 'fa-star']
const CONSECUENCIAS_META = [
  { icon: 'fa-battery-empty', color: 'text-coral', bg: 'bg-coral/10', border: 'border-coral/25', glow: 'rgba(229,123,134,0.07)' },
  { icon: 'fa-heart-crack', color: 'text-sec', bg: 'bg-sec/10', border: 'border-sec/25', glow: 'rgba(129,106,183,0.07)' },
  { icon: 'fa-fire-flame-curved', color: 'text-coral', bg: 'bg-coral/10', border: 'border-coral/25', glow: 'rgba(229,123,134,0.07)' },
  { icon: 'fa-cloud-rain', color: 'text-pri', bg: 'bg-pri/10', border: 'border-pri/25', glow: 'rgba(58,130,202,0.07)' },
  { icon: 'fa-user-question', color: 'text-acc', bg: 'bg-acc/10', border: 'border-acc/25', glow: 'rgba(72,176,161,0.07)' },
]
const ESTRATEGIAS_ICONS = ['fa-seedling', 'fa-battery-half', 'fa-hand-holding-heart', 'fa-circle-info', 'fa-person-walking']

// ── Sub-components ─────────────────────────────────────────────────────────────

function InfoCard({ item, index, prefersReduced, color = 'text-pri', bg = 'bg-pri/10' }) {
  return (
    <motion.div
      initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: prefersReduced ? 0 : 0.4, delay: prefersReduced ? 0 : index * 0.07 }}
      className="flex items-start gap-3 p-4 rounded-card border border-border bg-surface"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${bg} ${color}`}>
        <i className={`fa-solid ${item.icon} text-sm`} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-text leading-snug mb-0.5">{item.titulo}</p>
        <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
      </div>
    </motion.div>
  )
}

function ConsequenceCard({ item, index, prefersReduced }) {
  return (
    <motion.div
      initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: prefersReduced ? 0 : 0.4, delay: prefersReduced ? 0 : index * 0.08 }}
      className={`relative flex items-start gap-3 p-4 rounded-card border ${item.border} overflow-hidden`}
      style={{ background: `radial-gradient(ellipse at 0% 0%, ${item.glow}, transparent 60%)` }}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.bg} ${item.color}`}>
        <i className={`fa-solid ${item.icon} text-sm`} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text leading-snug mb-0.5">{item.titulo}</p>
        <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
      </div>
      <TTSButton text={item.tts} />
    </motion.div>
  )
}

function AccordionItem({ item, prefersReduced, isOpen, onToggle }) {
  return (
    <div className="border border-border rounded-card overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left bg-surface hover:bg-white/3 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pri focus-visible:ring-inset"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <i className="fa-solid fa-circle-xmark text-coral text-xs shrink-0" aria-hidden="true" />
          <span className="text-sm font-medium text-muted line-through leading-snug">{item.mito}</span>
        </div>
        <i
          className={`fa-solid fa-chevron-down text-[10px] text-faint shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-border/50 bg-surface">
              <div className="flex items-start gap-2.5 mt-3">
                <i className="fa-solid fa-circle-check text-acc text-xs shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm text-muted leading-relaxed">{item.realidad}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function MaskingPage() {
  const { t } = useTranslation(['masking', 'pages'])
  usePageMeta({
    title: t('masking:meta.title'),
    description: t('masking:meta.description'),
  })
  useJsonLd(articleLd({
    titulo: t('masking:articleTitulo'),
    descripcion: t('masking:meta.description'),
    ruta: '/entender-y-prepararse/masking',
  }), 'article')
  const prefersReduced = useReducedMotion()
  const [openMito, setOpenMito] = useState(null)

  const toggleMito = (index) => setOpenMito(prev => prev === index ? null : index)

  const RAZONES = t('masking:razones', { returnObjects: true }).map((item, i) => ({ ...item, icon: RAZONES_ICONS[i] }))
  const EJEMPLOS = t('masking:ejemplos', { returnObjects: true }).map((item, i) => ({ ...item, icon: EJEMPLOS_ICONS[i] }))
  const CONSECUENCIAS = t('masking:consecuencias', { returnObjects: true }).map((item, i) => ({ ...item, ...CONSECUENCIAS_META[i] }))
  const CHECKLIST = t('masking:checklist.items', { returnObjects: true })
  const ESTRATEGIAS = t('masking:estrategias', { returnObjects: true }).map((item, i) => ({ ...item, icon: ESTRATEGIAS_ICONS[i] }))
  const MITOS = t('masking:mitos', { returnObjects: true })

  return (
    <div className="max-w-3xl mx-auto px-4 pb-20 pt-8">
      <Breadcrumb items={[
        { href: '/', label: t('pages:breadcrumbHome') },
        { href: '/entender-y-prepararse', label: t('pages:entenderPrepararse.breadcrumb') },
        { label: t('masking:breadcrumb') },
      ]} />

      {/* Header */}
      <motion.div
        initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReduced ? 0 : 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-pri/10 flex items-center justify-center text-pri shrink-0">
            <i className="fa-solid fa-masks-theater" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text leading-tight">{t('masking:heading')}</h1>
            <p className="text-sm text-muted">{t('masking:sub')}</p>
          </div>
        </div>
      </motion.div>

      {/* Qué es */}
      <section aria-labelledby="que-es-heading" className="mb-8">
        <motion.div
          initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: prefersReduced ? 0 : 0.4 }}
          className="relative p-5 rounded-card border border-pri/25 bg-pri/5 overflow-hidden"
        >
          <div
            className="absolute inset-0 pointer-events-none rounded-card"
            style={{ background: 'radial-gradient(ellipse at 10% 10%, rgba(58,130,202,0.07), transparent 60%)' }}
            aria-hidden="true"
          />
          <div className="relative flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 id="que-es-heading" className="text-base font-bold text-text mb-2">{t('masking:queEs.heading')}</h2>
              <p className="text-sm text-muted leading-relaxed mb-2">
                {t('masking:queEs.p1')}
              </p>
              <p className="text-sm text-muted leading-relaxed">
                {t('masking:queEs.p2')}
              </p>
            </div>
            <TTSButton text={t('masking:queEs.tts')} />
          </div>
        </motion.div>
      </section>

      {/* Por qué ocurre */}
      <section aria-labelledby="razones-heading" className="mb-8">
        <motion.div
          initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: prefersReduced ? 0 : 0.4 }}
          className="mb-3"
        >
          <h2 id="razones-heading" className="text-base font-bold text-text">{t('masking:razonesHeading')}</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {RAZONES.map((item, i) => (
            <InfoCard key={item.titulo} item={item} index={i} prefersReduced={prefersReduced} />
          ))}
        </div>
      </section>

      {/* Ejemplos cotidianos */}
      <section aria-labelledby="ejemplos-heading" className="mb-8">
        <motion.div
          initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: prefersReduced ? 0 : 0.4 }}
          className="mb-3"
        >
          <h2 id="ejemplos-heading" className="text-base font-bold text-text">{t('masking:ejemplosHeading')}</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {EJEMPLOS.map((item, i) => (
            <InfoCard key={item.titulo} item={item} index={i} prefersReduced={prefersReduced} color="text-sec" bg="bg-sec/10" />
          ))}
        </div>
      </section>

      {/* Consecuencias */}
      <section aria-labelledby="consecuencias-heading" className="mb-8">
        <motion.div
          initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: prefersReduced ? 0 : 0.4 }}
          className="mb-3"
        >
          <h2 id="consecuencias-heading" className="text-base font-bold text-text">{t('masking:consecuenciasHeading')}</h2>
        </motion.div>
        <div className="space-y-2.5">
          {CONSECUENCIAS.map((item, i) => (
            <ConsequenceCard key={item.titulo} item={item} index={i} prefersReduced={prefersReduced} />
          ))}
        </div>
      </section>

      {/* Checklist */}
      <section aria-labelledby="checklist-heading" className="mb-8">
        <motion.div
          initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: prefersReduced ? 0 : 0.4 }}
          className="relative p-5 rounded-card border border-acc/25 bg-acc/5 overflow-hidden"
        >
          <div
            className="absolute inset-0 pointer-events-none rounded-card"
            style={{ background: 'radial-gradient(ellipse at 10% 10%, rgba(72,176,161,0.07), transparent 60%)' }}
            aria-hidden="true"
          />
          <div className="relative">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-acc/10 text-acc">
                  <i className="fa-solid fa-list-check text-sm" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="checklist-heading" className="text-base font-bold text-text leading-tight">{t('masking:checklist.heading')}</h2>
                  <p className="text-xs text-muted">{t('masking:checklist.sub')}</p>
                </div>
              </div>
              <TTSButton text={t('masking:checklist.tts')} />
            </div>
            <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
              {CHECKLIST.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted">
                  <i className="fa-solid fa-check text-acc text-[11px] mt-[3px] shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-faint leading-relaxed">
              {t('masking:checklist.footer')}
            </p>
          </div>
        </motion.div>
      </section>

      {/* Estrategias */}
      <section aria-labelledby="estrategias-heading" className="mb-8">
        <motion.div
          initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: prefersReduced ? 0 : 0.4 }}
          className="mb-3"
        >
          <h2 id="estrategias-heading" className="text-base font-bold text-text">{t('masking:estrategiasHeading')}</h2>
        </motion.div>
        <div className="space-y-2.5">
          {ESTRATEGIAS.map((item, i) => (
            <motion.div
              key={item.titulo}
              initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: prefersReduced ? 0 : 0.4, delay: prefersReduced ? 0 : i * 0.07 }}
              className="flex items-start gap-3 p-4 rounded-card border border-border bg-surface"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-pri/10 text-pri">
                <i className={`fa-solid ${item.icon} text-sm`} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text leading-snug mb-0.5">{item.titulo}</p>
                <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mitos */}
      <section aria-labelledby="mitos-heading" className="mb-8">
        <motion.div
          initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: prefersReduced ? 0 : 0.4 }}
          className="mb-3"
        >
          <h2 id="mitos-heading" className="text-base font-bold text-text">{t('masking:mitosHeading')}</h2>
        </motion.div>
        <div className="space-y-2">
          {MITOS.map((item, i) => (
            <motion.div
              key={item.mito}
              initial={prefersReduced ? {} : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: prefersReduced ? 0 : 0.35, delay: prefersReduced ? 0 : i * 0.06 }}
            >
              <AccordionItem
                item={item}
                prefersReduced={prefersReduced}
                isOpen={openMito === i}
                onToggle={() => toggleMito(i)}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Nav links */}
      <nav aria-label={t('masking:continueAriaLabel')} className="grid sm:grid-cols-2 gap-3">
        {[
          {
            to: '/entender-y-prepararse/estados',
            icon: 'fa-brain',
            color: 'text-coral',
            bg: 'bg-coral/10',
            border: 'border-coral/25',
            bgCard: 'bg-coral/5',
            label: t('masking:links.estados.label'),
            desc: t('masking:links.estados.desc'),
          },
          {
            to: '/entender-y-prepararse/guias',
            icon: 'fa-masks-theater',
            color: 'text-pri',
            bg: 'bg-pri/10',
            border: 'border-pri/25',
            bgCard: 'bg-pri/5',
            label: t('masking:links.guia.label'),
            desc: t('masking:links.guia.desc'),
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
