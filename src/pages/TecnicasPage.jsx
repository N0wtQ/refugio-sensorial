import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { usePageMeta } from '../hooks/usePageMeta'
import { useJsonLd } from '../hooks/useJsonLd'
import { articleLd } from '../lib/seo'
import Breadcrumb from '../components/ui/Breadcrumb'
import TTSButton from '../components/ui/TTSButton'
import { REGULACION } from '../components/KitSensorial'

export default function TecnicasPage() {
  const { t } = useTranslation(['pages', 'kitSensorial'])
  usePageMeta({
    title: t('tecnicas.meta.title'),
    description: t('tecnicas.meta.description'),
  })
  useJsonLd(articleLd({
    titulo: '9 técnicas de regulación sensorial y emocional para crisis autistas',
    descripcion: '9 técnicas de regulación sensorial y emocional para aplicar en crisis autista: frío, respiración, grounding, movimiento, presión y más.',
    ruta: '/entender-y-prepararse/tecnicas',
  }), 'article')
  const prefersReduced = useReducedMotion()

  return (
    <div className="max-w-3xl mx-auto px-4 pb-20 pt-8">
      <Breadcrumb items={[
        { href: '/', label: t('breadcrumbHome') },
        { href: '/entender-y-prepararse', label: t('entenderPrepararse.breadcrumb') },
        { label: t('tecnicas.breadcrumb') },
      ]} />

      <motion.div
        initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReduced ? 0 : 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-acc/10 flex items-center justify-center text-acc shrink-0">
            <i className="fa-solid fa-heart-pulse" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text leading-tight">{t('tecnicas.heading')}</h1>
            <p className="text-sm text-muted">{t('tecnicas.sub')}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
        {REGULACION.map((item, i) => (
          <motion.div
            key={item.titulo}
            initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: prefersReduced ? 0 : 0.4, delay: prefersReduced ? 0 : i * 0.06 }}
            className="flex flex-col p-4 rounded-card border border-border bg-surface gap-3"
          >
            <div className="flex items-start gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 ${item.bg} ${item.color}`}>
                <i className={`fa-solid ${item.icon}`} aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text mb-0.5">{t(`kitSensorial:regulacion.${item.titulo}.titulo`)}</p>
                <p className="text-xs text-muted leading-relaxed">{t(`kitSensorial:regulacion.${item.titulo}.desc`)}</p>
              </div>
            </div>
            <TTSButton text={t(`kitSensorial:regulacion.${item.titulo}.tts`)} className="self-end" />
          </motion.div>
        ))}
      </div>

      <nav aria-label={t('tecnicas.exploreAriaLabel')} className="grid sm:grid-cols-2 gap-3">
        {[
          {
            to: '/herramientas',
            icon: 'fa-toolbox',
            color: 'text-sec',
            bg: 'bg-sec/10',
            border: 'border-sec/25',
            bgCard: 'bg-sec/5',
            label: t('tecnicas.links.herramientas.label'),
            desc: t('tecnicas.links.herramientas.desc'),
          },
          {
            to: '/entender-y-prepararse/guias',
            icon: 'fa-folder-open',
            color: 'text-pri',
            bg: 'bg-pri/10',
            border: 'border-pri/25',
            bgCard: 'bg-pri/5',
            label: t('tecnicas.links.guias.label'),
            desc: t('tecnicas.links.guias.desc'),
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
