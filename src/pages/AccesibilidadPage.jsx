import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePageMeta } from '../hooks/usePageMeta'

const CRITERIA = [
  { id: '1.1.1', level: 'A',   status: 'pass' },
  { id: '1.3.1', level: 'A',   status: 'pass' },
  { id: '1.3.2', level: 'A',   status: 'pass' },
  { id: '1.4.1', level: 'A',   status: 'pass' },
  { id: '1.4.3', level: 'AA',  status: 'partial' },
  { id: '1.4.4', level: 'AA',  status: 'pass' },
  { id: '1.4.10', level: 'AA', status: 'pass' },
  { id: '1.4.11', level: 'AA', status: 'pass' },
  { id: '2.1.1', level: 'A',   status: 'pass' },
  { id: '2.1.2', level: 'A',   status: 'pass' },
  { id: '2.3.3', level: 'AAA', status: 'pass' },
  { id: '2.4.1', level: 'A',   status: 'pass' },
  { id: '2.4.3', level: 'A',   status: 'pass' },
  { id: '2.4.4', level: 'A',   status: 'pass' },
  { id: '2.4.7', level: 'AA',  status: 'pass' },
  { id: '2.5.3', level: 'A',   status: 'pass' },
  { id: '3.1.1', level: 'A',   status: 'pass' },
  { id: '3.3.1', level: 'A',   status: 'pass' },
  { id: '3.3.2', level: 'A',   status: 'pass' },
  { id: '3.3.4', level: 'AA',  status: 'pass' },
  { id: '4.1.1', level: 'A',   status: 'pass' },
  { id: '4.1.2', level: 'A',   status: 'pass' },
  { id: '4.1.3', level: 'AA',  status: 'pass' },
]

const STATUS_COLOR  = {
  pass:    'bg-acc/10 text-acc border-acc/25',
  partial: 'bg-warm/10 text-warm border-warm/25',
  fail:    'bg-coral/10 text-coral border-coral/25',
  na:      'bg-surface text-muted border-border',
}
const LEVEL_COLOR = {
  A:   'bg-pri/10 text-pri border-pri/25',
  AA:  'bg-sec/10 text-sec border-sec/25',
  AAA: 'bg-acc/10 text-acc border-acc/25',
}

export default function AccesibilidadPage() {
  const { t } = useTranslation('pages')
  usePageMeta({
    title: t('accesibilidad.meta.title'),
    description: t('accesibilidad.meta.description'),
  })

  const pass    = CRITERIA.filter(c => c.status === 'pass').length
  const total   = CRITERIA.length
  const pct     = Math.round((pass / total) * 100)
  const commitments = t('accesibilidad.commitments', { returnObjects: true })
  const limitations = t('accesibilidad.limitations', { returnObjects: true })

  return (
    <div className="max-w-3xl mx-auto px-4 pb-20 pt-8">
      <nav aria-label={t('breadcrumbAriaLabel', { ns: 'common' })} className="mb-6 text-sm text-faint">
        <ol className="flex items-center gap-2 list-none p-0 m-0">
          <li><Link to="/" className="hover:text-text transition-colors duration-200">{t('breadcrumbHome')}</Link></li>
          <li aria-hidden="true"><i className="fa-solid fa-chevron-right text-[10px]" /></li>
          <li><span className="text-muted" aria-current="page">{t('accesibilidad.breadcrumb')}</span></li>
        </ol>
      </nav>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-acc/10 flex items-center justify-center text-acc shrink-0">
            <i className="fa-solid fa-universal-access" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text leading-tight">{t('accesibilidad.heading')}</h1>
            <p className="text-sm text-muted">{t('accesibilidad.updated')}</p>
          </div>
        </div>
        <p className="text-sm text-muted leading-relaxed">
          {t('accesibilidad.intro')}
        </p>
      </header>

      {/* Score */}
      <div className="flex items-center gap-4 p-5 rounded-card border border-acc/25 bg-acc/5 mb-8">
        <div className="shrink-0 text-center">
          <p className="text-4xl font-black text-acc leading-none">{pct}%</p>
          <p className="text-xs text-muted mt-1">{t('accesibilidad.scoreLabel')}</p>
        </div>
        <div className="flex-1">
          <div className="h-2 rounded-full bg-surface border border-border overflow-hidden mb-2">
            <div
              className="h-full rounded-full bg-acc transition-all duration-500"
              style={{ width: `${pct}%` }}
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={t('accesibilidad.scoreAriaLabel', { pct })}
            />
          </div>
          <p className="text-xs text-muted">{t('accesibilidad.scoreSummary', { pass, total })}</p>
        </div>
      </div>

      {/* Commitment */}
      <section aria-labelledby="compromiso-heading" className="mb-8">
        <h2 id="compromiso-heading" className="text-base font-bold text-text mb-3">{t('accesibilidad.commitmentsHeading')}</h2>
        <ul className="space-y-2">
          {commitments.map(item => (
            <li key={item} className="flex items-start gap-2 text-sm text-muted">
              <i className="fa-solid fa-circle-check text-acc text-xs mt-1 shrink-0" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Criteria table */}
      <section aria-labelledby="criterios-heading" className="mb-8">
        <h2 id="criterios-heading" className="text-base font-bold text-text mb-3">{t('accesibilidad.criteriaHeading')}</h2>
        <div className="rounded-card border border-border overflow-hidden">
          <table className="w-full text-sm" aria-label={t('accesibilidad.criteriaTableAriaLabel')}>
            <thead>
              <tr className="bg-surface border-b border-border">
                <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-muted">{t('accesibilidad.criteriaColCriterio')}</th>
                <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-muted hidden sm:table-cell">{t('accesibilidad.criteriaColNivel')}</th>
                <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-muted">{t('accesibilidad.criteriaColEstado')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {CRITERIA.map(c => (
                <tr key={c.id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-4 py-2.5">
                    <span className="font-mono text-xs text-faint mr-2">{c.id}</span>
                    <span className="text-muted">{t(`accesibilidad.criteria.${c.id}`)}</span>
                  </td>
                  <td className="px-4 py-2.5 hidden sm:table-cell">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${LEVEL_COLOR[c.level]}`}>
                      {c.level}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${STATUS_COLOR[c.status]}`}>
                      {t(`accesibilidad.status.${c.status}`)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Known limitations */}
      <section aria-labelledby="limitaciones-heading" className="mb-8">
        <h2 id="limitaciones-heading" className="text-base font-bold text-text mb-3">{t('accesibilidad.limitationsHeading')}</h2>
        <ul className="space-y-2">
          {limitations.map(item => (
            <li key={item} className="flex items-start gap-2 text-sm text-muted">
              <i className="fa-solid fa-triangle-exclamation text-warm text-xs mt-1 shrink-0" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Contact */}
      <section
        aria-labelledby="contacto-a11y-heading"
        className="p-5 rounded-card border border-pri/25 bg-pri/5"
      >
        <h2 id="contacto-a11y-heading" className="text-base font-bold text-text mb-2">{t('accesibilidad.contactHeading')}</h2>
        <p className="text-sm text-muted leading-relaxed mb-4">
          {t('accesibilidad.contactText')}
        </p>
        <Link
          to="/#contacto"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pri text-white text-sm font-semibold hover:bg-pri/85 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pri focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <i className="fa-solid fa-envelope text-xs" aria-hidden="true" />
          {t('accesibilidad.contactCta')}
        </Link>
      </section>
    </div>
  )
}
