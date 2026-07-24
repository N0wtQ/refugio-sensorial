import { useTranslation } from 'react-i18next'
import ResourceLibrary from '../components/ResourceLibrary'
import { usePageMeta } from '../hooks/usePageMeta'
import Breadcrumb from '../components/ui/Breadcrumb'

export default function LibraryPage() {
  const { t } = useTranslation(['pages', 'nav'])
  usePageMeta({
    title: t('pages:library.meta.title'),
    description: t('pages:library.meta.description'),
  })
  return (
    <div className="max-w-5xl mx-auto px-4 pb-20 pt-8">
      <Breadcrumb items={[
        { href: '/', label: t('pages:breadcrumbHome') },
        { label: t('nav:links.herramientas.label') },
      ]} />

      {/* Header */}
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sec/10 border border-sec/20 text-sec text-xs font-semibold uppercase tracking-wider mb-4">
          <i className="fa-solid fa-toolbox text-[10px]" aria-hidden="true" />
          {t('pages:library.badge')}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-text leading-tight mb-3">
          {t('pages:library.heading')}
        </h1>
        <p className="text-muted text-base leading-relaxed max-w-2xl">
          {t('pages:library.sub')}
        </p>
      </header>

      <ResourceLibrary />
    </div>
  )
}
