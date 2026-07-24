/**
 * EntenderEstadoPage — individual page for /entender-y-prepararse/estados/:slug
 * Shows full detail: qué es, señales, qué ayuda, qué evitar, related content.
 */

import { useMemo } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { usePageMeta } from '../hooks/usePageMeta'
import { useJsonLd } from '../hooks/useJsonLd'
import { articleLd } from '../lib/seo'
import Breadcrumb from '../components/ui/Breadcrumb'
import RelatedContent from '../components/ui/RelatedContent'
import { ESTADOS } from '../components/KitSensorial'
import {
  SLUG_TO_ESTADO_ID,
  getRelatedForEstado,
} from '../lib/content-graph/index'

function List({ items, icon, iconColor }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm text-muted leading-relaxed">
          <i className={`fa-solid ${icon} ${iconColor} text-xs mt-1 shrink-0`} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function Section({ title, children, className = '' }) {
  return (
    <section className={`${className}`}>
      <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">{title}</h2>
      {children}
    </section>
  )
}

export default function EntenderEstadoPage() {
  const { slug } = useParams()
  const { t } = useTranslation(['pages', 'kitSensorial', 'nav'])
  const prefersReduced = useReducedMotion()

  const estadoId = SLUG_TO_ESTADO_ID[slug]
  const estado = useMemo(() => ESTADOS.find(e => e.id === estadoId), [estadoId])

  const titulo = estado ? t(`kitSensorial:estados.${estadoId}.titulo`) : ''
  const subtitulo = estado ? t(`kitSensorial:estados.${estadoId}.subtitulo`) : ''
  const que = estado ? t(`kitSensorial:estados.${estadoId}.que`) : ''
  const signos = estado ? t(`kitSensorial:estados.${estadoId}.signos`, { returnObjects: true }) : []
  const ayuda = estado ? t(`kitSensorial:estados.${estadoId}.ayuda`, { returnObjects: true }) : []
  const tts = estado ? t(`kitSensorial:estados.${estadoId}.tts`) : ''
  const evitar = estado ? t(`pages:entenderEstado.evitar.${estadoId}`, { returnObjects: true, defaultValue: [] }) : []
  const duracion = estado ? t(`pages:entenderEstado.duracion.${estadoId}`, { defaultValue: '' }) : ''

  usePageMeta({
    title: estado
      ? t('pages:entenderEstado.metaTitle', { titulo, subtitulo })
      : t('pages:entenderEstado.metaTitleFallback', { slug }),
    description: que,
    section: 'estados',
  })
  useJsonLd(estado ? articleLd({
    titulo: `${titulo}: ${subtitulo}`,
    descripcion: que,
    ruta: `/entender-y-prepararse/estados/${slug}`,
  }) : null, 'article')

  if (!estado) return <Navigate to="/entender-y-prepararse/estados" replace />

  const relatedItems = getRelatedForEstado(estadoId)
  const otrosEstados = ESTADOS.filter(e => e.id !== estadoId)

  const breadcrumbItems = [
    { href: '/',                              label: t('pages:breadcrumbHome') },
    { href: '/entender-y-prepararse',         label: t('pages:entenderPrepararse.breadcrumb') },
    { href: '/entender-y-prepararse/estados', label: t('pages:estados.breadcrumb') },
    {                                          label: titulo },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      <Breadcrumb items={breadcrumbItems} className="mb-8" />

      {/* Hero */}
      <motion.div
        initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReduced ? 0 : 0.4 }}
        className={`relative rounded-card border ${estado.borderColor} ${estado.bgColor} p-6 mb-8 overflow-hidden`}
      >
        <div
          className="absolute inset-0 pointer-events-none rounded-card"
          style={{ background: `radial-gradient(ellipse at 10% 10%, ${estado.glowColor}, transparent 60%)` }}
          aria-hidden="true"
        />
        <div className="relative flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${estado.iconBg}`}>
            <i className={`fa-solid ${estado.icon} ${estado.iconColor} text-xl`} aria-hidden="true" />
          </div>
          <div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${estado.badgeBg} uppercase tracking-wider`}>
              {subtitulo}
            </span>
            <h1 className="text-2xl font-bold text-text mt-1 mb-2">{titulo}</h1>
            <p className="text-sm text-muted leading-relaxed">{que}</p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-8">
        {/* Señales */}
        <Section title={t('pages:entenderEstado.sections.senales')}>
          <div className={`p-4 rounded-xl border ${estado.borderColor} bg-surface`}>
            <List items={signos} icon="fa-circle-dot" iconColor={`text-${estado.color}`} />
          </div>
        </Section>

        {/* Qué ayuda */}
        <Section title={t('pages:entenderEstado.sections.queAyuda')}>
          <div className="p-4 rounded-xl border border-acc/20 bg-acc/5">
            <List items={ayuda} icon="fa-check" iconColor="text-acc" />
          </div>
        </Section>

        {/* Qué evitar */}
        {evitar.length > 0 && (
          <Section title={t('pages:entenderEstado.sections.queEvitar')}>
            <div className="p-4 rounded-xl border border-coral/20 bg-coral/5">
              <List items={evitar} icon="fa-xmark" iconColor="text-coral" />
            </div>
          </Section>
        )}

        {/* Duración */}
        {duracion && (
          <Section title={t('pages:entenderEstado.sections.duracion')}>
            <div className="p-4 rounded-xl border border-border bg-surface flex items-start gap-3">
              <i className="fa-regular fa-clock text-faint text-sm mt-0.5 shrink-0" aria-hidden="true" />
              <p className="text-sm text-muted leading-relaxed">{duracion}</p>
            </div>
          </Section>
        )}

        {/* Audio description */}
        {tts && (
          <Section title={t('pages:entenderEstado.sections.descripcionCrisis')}>
            <div className={`p-4 rounded-xl border ${estado.borderColor} bg-surface`}>
              <p className="text-sm text-muted leading-relaxed italic">"{tts}"</p>
            </div>
          </Section>
        )}

        {/* Related content */}
        {relatedItems.length > 0 && (
          <RelatedContent
            items={relatedItems}
            title={t('pages:entenderEstado.sections.recursosRelacionados')}
          />
        )}

        {/* Other estados */}
        <section>
          <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">{t('pages:entenderEstado.sections.otrosEstados')}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {otrosEstados.map(e => (
              <Link
                key={e.id}
                to={`/entender-y-prepararse/estados/${e.id === 'burnout' ? 'burnout-autista' : e.id}`}
                className={`group flex items-center gap-3 p-4 rounded-xl border ${e.borderColor} bg-surface
                            hover:bg-surfaceH hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/20
                            transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pri`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${e.iconBg}`}>
                  <i className={`fa-solid ${e.icon} ${e.iconColor} text-sm`} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text group-hover:text-pri transition-colors duration-200">{t(`kitSensorial:estados.${e.id}.titulo`)}</p>
                  <p className="text-xs text-muted">{t(`kitSensorial:estados.${e.id}.subtitulo`)}</p>
                </div>
                <i className="fa-solid fa-chevron-right text-faint text-[10px] ml-auto" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>

        {/* Bottom CTAs */}
        <div className="grid sm:grid-cols-2 gap-3 pt-2">
          <Link
            to="/entender-y-prepararse/tecnicas"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-surface border border-border
                       text-sm font-semibold text-muted hover:border-acc/30 hover:text-text transition-all duration-200"
          >
            <i className="fa-solid fa-heart-pulse text-acc text-xs" aria-hidden="true" />
            {t('pages:entenderEstado.ctaTecnicas')}
          </Link>
          <Link
            to="/ayuda"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-coral/10 border border-coral/25
                       text-sm font-semibold text-coral hover:bg-coral/20 transition-all duration-200"
          >
            <i className="fa-solid fa-circle-exclamation text-xs" aria-hidden="true" />
            {t('pages:entenderEstado.ctaAyuda')}
          </Link>
        </div>
      </div>
    </div>
  )
}
