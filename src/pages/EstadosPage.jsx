import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { usePageMeta } from '../hooks/usePageMeta'
import { useJsonLd } from '../hooks/useJsonLd'
import { articleLd } from '../lib/seo'
import Breadcrumb from '../components/ui/Breadcrumb'
import { ESTADOS, EstadoCard } from '../components/KitSensorial'

export default function EstadosPage() {
  const { t } = useTranslation('pages')
  usePageMeta({
    title: t('estados.meta.title'),
    description: t('estados.meta.description'),
  })
  useJsonLd(articleLd({
    titulo: 'Meltdown, shutdown y burnout autista: qué son y cómo diferenciarlos',
    descripcion: 'Entiende qué son el meltdown, el shutdown y el burnout autista, por qué ocurren y cómo diferenciarlos. Señales, estrategias de ayuda e infografías descargables.',
    ruta: '/entender-y-prepararse/estados',
  }), 'article')
  const prefersReduced = useReducedMotion()

  return (
    <div className="max-w-3xl mx-auto px-4 pb-20 pt-8">
      <Breadcrumb items={[
        { href: '/', label: t('breadcrumbHome') },
        { href: '/entender-y-prepararse', label: t('entenderPrepararse.breadcrumb') },
        { label: t('estados.breadcrumb') },
      ]} />

      <motion.div
        initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReduced ? 0 : 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center text-coral shrink-0">
            <i className="fa-solid fa-brain" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text leading-tight">{t('estados.heading')}</h1>
            <p className="text-sm text-muted">{t('estados.sub')}</p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-3 mb-10">
        {ESTADOS.map((estado, i) => (
          <EstadoCard
            key={estado.id}
            estado={estado}
            prefersReduced={prefersReduced}
            index={i}
          />
        ))}
      </div>

      <nav aria-label={t('estados.continueAriaLabel')} className="grid sm:grid-cols-3 gap-3">
        {[
          {
            to: '/entender-y-prepararse/senales',
            icon: 'fa-triangle-exclamation',
            color: 'text-sec',
            bg: 'bg-sec/10',
            border: 'border-sec/25',
            bgCard: 'bg-sec/5',
            label: t('estados.links.senales.label'),
            desc: t('estados.links.senales.desc'),
          },
          {
            to: '/entender-y-prepararse/tecnicas',
            icon: 'fa-heart-pulse',
            color: 'text-acc',
            bg: 'bg-acc/10',
            border: 'border-acc/25',
            bgCard: 'bg-acc/5',
            label: t('estados.links.tecnicas.label'),
            desc: t('estados.links.tecnicas.desc'),
          },
          {
            to: '/ayuda',
            icon: 'fa-phone',
            color: 'text-coral',
            bg: 'bg-coral/10',
            border: 'border-coral/25',
            bgCard: 'bg-coral/5',
            label: t('estados.links.ayuda.label'),
            desc: t('estados.links.ayuda.desc'),
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
