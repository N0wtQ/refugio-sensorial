import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageMeta } from '../hooks/usePageMeta'
import Breadcrumb from '../components/ui/Breadcrumb'

const SilentMap = lazy(() => import('../components/SilentMap'))

export default function MapPage() {
  const { t } = useTranslation(['pages', 'nav'])
  usePageMeta({
    title: t('pages:map.meta.title'),
    description: t('pages:map.meta.description'),
  })
  return (
    <div className="max-w-5xl mx-auto px-4 pb-20 pt-8">
      <Breadcrumb items={[
        { href: '/', label: t('pages:breadcrumbHome') },
        { label: t('nav:links.map') },
      ]} />

      {/* Header */}
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pri/10 border border-pri/20 text-pri text-xs font-semibold uppercase tracking-wider mb-4">
          <i className="fa-solid fa-location-dot text-[10px]" aria-hidden="true" />
          {t('pages:map.badge')}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-text leading-tight mb-3">
          {t('pages:map.heading')}
        </h1>
        <p className="text-muted text-base leading-relaxed max-w-2xl">
          {t('pages:map.sub')}
        </p>
      </header>

      {/* Map */}
      <Suspense
        fallback={
          <div
            role="status"
            aria-live="polite"
            aria-label={t('pages:map.loadingAriaLabel')}
            className="flex items-center justify-center rounded-card border border-border bg-surface"
            style={{ height: '520px' }}
          >
            <div className="text-center">
              <i className="fa-solid fa-spinner fa-spin text-2xl text-muted mb-3 block" aria-hidden="true" />
              <p className="text-muted text-sm">{t('pages:map.loading')}</p>
            </div>
          </div>
        }
      >
        <SilentMap />
      </Suspense>
    </div>
  )
}
