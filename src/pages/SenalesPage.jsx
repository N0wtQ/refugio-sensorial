import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useReducedMotion } from '../hooks/useReducedMotion'
import TTSButton from '../components/ui/TTSButton'
import { usePageMeta } from '../hooks/usePageMeta'
import { useJsonLd } from '../hooks/useJsonLd'
import { articleLd } from '../lib/seo'
import Breadcrumb from '../components/ui/Breadcrumb'

// Presentational metadata (icon/color) stays here; titulo/subtitulo/tts/items
// come from the 'senales' i18n namespace, keyed by this same id.
const SENALES = [
  { id: 'corporales', icon: 'fa-person', color: 'text-coral', bg: 'bg-coral/10', borderColor: 'border-coral/30', bgCard: 'bg-coral/5', glowColor: 'rgba(229,123,134,0.07)' },
  { id: 'cognitivas', icon: 'fa-brain', color: 'text-pri', bg: 'bg-pri/10', borderColor: 'border-pri/30', bgCard: 'bg-pri/5', glowColor: 'rgba(58,130,202,0.07)' },
  { id: 'emocionales', icon: 'fa-heart-crack', color: 'text-sec', bg: 'bg-sec/10', borderColor: 'border-sec/30', bgCard: 'bg-sec/5', glowColor: 'rgba(129,106,183,0.07)' },
  { id: 'conductuales', icon: 'fa-arrows-spin', color: 'text-acc', bg: 'bg-acc/10', borderColor: 'border-acc/30', bgCard: 'bg-acc/5', glowColor: 'rgba(72,176,161,0.07)' },
]

const ACCIONES_ICONS = ['fa-door-open', 'fa-heart-pulse', 'fa-user-group', 'fa-calendar-xmark', 'fa-ban', 'fa-kit-medical']

function SeccionCard({ seccion, t, prefersReduced, index }) {
  const titulo = t(`senales:secciones.${seccion.id}.titulo`)
  const tts = t(`senales:secciones.${seccion.id}.tts`)
  const items = t(`senales:secciones.${seccion.id}.items`, { returnObjects: true })
  return (
    <motion.div
      initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: prefersReduced ? 0 : 0.4, delay: prefersReduced ? 0 : index * 0.08 }}
      className={`relative rounded-card border ${seccion.borderColor} ${seccion.bgCard} p-5 overflow-hidden`}
    >
      <div
        className="absolute inset-0 pointer-events-none rounded-card"
        style={{ background: `radial-gradient(ellipse at 10% 10%, ${seccion.glowColor}, transparent 60%)` }}
        aria-hidden="true"
      />
      <div className="relative">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${seccion.bg} ${seccion.color}`}>
              <i className={`fa-solid ${seccion.icon} text-sm`} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text leading-tight">{titulo}</h2>
              <p className="text-xs text-muted">{t(`senales:secciones.${seccion.id}.subtitulo`)}</p>
            </div>
          </div>
          <TTSButton text={tts} />
        </div>
        <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5 mt-1">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-muted">
              <i className={`fa-solid fa-circle text-[5px] mt-2 shrink-0 ${seccion.color}`} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

export default function SenalesPage() {
  const { t } = useTranslation(['senales', 'pages'])
  usePageMeta({
    title: t('senales:meta.title'),
    description: t('senales:meta.description'),
  })
  useJsonLd(articleLd({
    titulo: t('senales:articleTitulo'),
    descripcion: t('senales:meta.description'),
    ruta: '/entender-y-prepararse/senales',
  }), 'article')
  const prefersReduced = useReducedMotion()
  const acciones = t('senales:acciones.items', { returnObjects: true })

  return (
    <div className="max-w-3xl mx-auto px-4 pb-20 pt-8">
      <Breadcrumb items={[
        { href: '/', label: t('pages:breadcrumbHome') },
        { href: '/entender-y-prepararse', label: t('pages:entenderPrepararse.breadcrumb') },
        { label: t('senales:breadcrumb') },
      ]} />

      <motion.div
        initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReduced ? 0 : 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center text-coral shrink-0">
            <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text leading-tight">{t('senales:heading')}</h1>
            <p className="text-sm text-muted">{t('senales:sub')}</p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-4 mb-6">
        {SENALES.map((seccion, i) => (
          <SeccionCard key={seccion.id} seccion={seccion} t={t} prefersReduced={prefersReduced} index={i} />
        ))}
      </div>

      {/* Qué hacer */}
      <motion.div
        initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: prefersReduced ? 0 : 0.4, delay: prefersReduced ? 0 : 0.32 }}
        className="relative rounded-card border border-acc/30 bg-acc/5 p-5 overflow-hidden"
      >
        <div
          className="absolute inset-0 pointer-events-none rounded-card"
          style={{ background: 'radial-gradient(ellipse at 10% 10%, rgba(72,176,161,0.07), transparent 60%)' }}
          aria-hidden="true"
        />
        <div className="relative">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-acc/10 text-acc">
                <i className="fa-solid fa-shield-halved text-sm" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-bold text-text leading-tight">{t('senales:acciones.titulo')}</h2>
                <p className="text-xs text-muted">{t('senales:acciones.subtitulo')}</p>
              </div>
            </div>
            <TTSButton text={t('senales:acciones.tts')} />
          </div>
          <ul className="grid sm:grid-cols-2 gap-2.5">
            {acciones.map((texto, i) => (
              <li key={texto} className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 bg-acc/10 text-acc border border-acc/20">
                  <i className={`fa-solid ${ACCIONES_ICONS[i]}`} aria-hidden="true" />
                </div>
                <p className="text-sm text-muted leading-snug mt-0.5">{texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      <nav aria-label={t('senales:continueAriaLabel')} className="grid sm:grid-cols-2 gap-3 mt-8">
        {[
          {
            to: '/entender-y-prepararse/tecnicas',
            icon: 'fa-heart-pulse',
            color: 'text-acc',
            bg: 'bg-acc/10',
            border: 'border-acc/25',
            bgCard: 'bg-acc/5',
            label: t('senales:links.tecnicas.label'),
            desc: t('senales:links.tecnicas.desc'),
          },
          {
            to: '/entender-y-prepararse/kit-de-bolso',
            icon: 'fa-kit-medical',
            color: 'text-pri',
            bg: 'bg-pri/10',
            border: 'border-pri/25',
            bgCard: 'bg-pri/5',
            label: t('senales:links.kitBolso.label'),
            desc: t('senales:links.kitBolso.desc'),
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
