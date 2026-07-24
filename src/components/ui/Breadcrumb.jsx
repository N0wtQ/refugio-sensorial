import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useJsonLd } from '../../hooks/useJsonLd'

const SITE_URL = 'https://www.refugio-sensorial.com'

export default function Breadcrumb({ items }) {
  const { t } = useTranslation('common')
  useJsonLd({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  })

  return (
    <nav aria-label={t('breadcrumbAriaLabel')} className="mb-6 text-sm text-faint">
      <ol className="flex items-center gap-2 list-none p-0 m-0 flex-wrap">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2">
            {idx > 0 && (
              <i className="fa-solid fa-chevron-right text-[10px]" aria-hidden="true" />
            )}
            {item.href ? (
              <Link to={item.href} className="hover:text-text transition-colors duration-200">
                {item.label}
              </Link>
            ) : (
              <span className="text-muted" aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
