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
import { KITS, KitSelectorCard } from '../components/KitSensorial'

export default function KitBolsoPage() {
  const { t } = useTranslation('pages')
  usePageMeta({
    title: t('kitBolso.meta.title'),
    description: t('kitBolso.meta.description'),
  })
  useJsonLd(articleLd({
    titulo: 'Kit de bolso sensorial para personas autistas: qué llevar al salir',
    descripcion: 'Elige el tamaño de tu kit sensorial de bolso y descubre qué meter para estar preparado ante cualquier situación fuera de casa.',
    ruta: '/entender-y-prepararse/kit-de-bolso',
  }), 'article')
  const prefersReduced = useReducedMotion()
  const [selectedKit, setSelectedKit] = useState('grande')
  const activeKit = KITS.find(k => k.id === selectedKit)

  return (
    <div className="max-w-3xl mx-auto px-4 pb-20 pt-8">
      <Breadcrumb items={[
        { href: '/', label: t('breadcrumbHome') },
        { href: '/entender-y-prepararse', label: t('entenderPrepararse.breadcrumb') },
        { label: t('kitBolso.breadcrumb') },
      ]} />

      <motion.div
        initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReduced ? 0 : 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-pri/10 flex items-center justify-center text-pri shrink-0">
            <i className="fa-solid fa-kit-medical" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text leading-tight">{t('kitBolso.heading')}</h1>
            <p className="text-sm text-muted">{t('kitBolso.sub')}</p>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-center gap-6 mb-8" role="group" aria-label={t('kitBolso.sizeGroupAriaLabel')}>
        {KITS.map(kit => (
          <KitSelectorCard
            key={kit.id}
            kit={kit}
            selected={selectedKit === kit.id}
            onClick={() => setSelectedKit(kit.id)}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedKit}
          initial={prefersReduced ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReduced ? {} : { opacity: 0, y: -8 }}
          transition={{ duration: prefersReduced ? 0 : 0.25 }}
          className={`relative rounded-card border ${activeKit.borderColor} ${activeKit.bgColor} p-6 overflow-hidden mb-10`}
        >
          <div
            className="absolute inset-0 pointer-events-none rounded-card"
            style={{ background: `radial-gradient(ellipse at 5% 5%, ${activeKit.glowColor}, transparent 55%)` }}
            aria-hidden="true"
          />
          <div className="relative">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <h2 className={`text-base font-bold ${activeKit.color}`}>{activeKit.label}</h2>
                <p className="text-xs text-muted mt-0.5">{activeKit.sublabel}</p>
              </div>
              <div className="flex items-center gap-2">
                <TTSButton iconOnly text={activeKit.tts} />
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${activeKit.badgeBg}`}>
                  {t('kitBolso.itemsCount', { count: activeKit.items.length })}
                </span>
              </div>
            </div>

            <ul className="grid sm:grid-cols-2 gap-2.5 list-none p-0 m-0">
              {activeKit.items.map(item => (
                <li key={item.label} className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${activeKit.bgColor} ${activeKit.color} border ${activeKit.borderColor}`}>
                    <i className={`fa-solid ${item.icon}`} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text leading-snug">{item.label}</p>
                    <p className="text-xs text-muted">{item.nota}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>

      <nav aria-label={t('kitBolso.alsoInterestedAriaLabel')} className="grid sm:grid-cols-2 gap-3">
        {[
          {
            to: '/entender-y-prepararse/senales',
            icon: 'fa-triangle-exclamation',
            color: 'text-sec',
            bg: 'bg-sec/10',
            border: 'border-sec/25',
            bgCard: 'bg-sec/5',
            label: t('kitBolso.links.senales.label'),
            desc: t('kitBolso.links.senales.desc'),
          },
          {
            to: '/entender-y-prepararse/tecnicas',
            icon: 'fa-heart-pulse',
            color: 'text-acc',
            bg: 'bg-acc/10',
            border: 'border-acc/25',
            bgCard: 'bg-acc/5',
            label: t('kitBolso.links.tecnicas.label'),
            desc: t('kitBolso.links.tecnicas.desc'),
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
