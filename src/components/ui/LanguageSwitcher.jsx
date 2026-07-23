import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { setLanguage } from '../../i18n/index'

// Two-state segmented toggle — a dropdown would be overkill for only 2 languages.
export default function LanguageSwitcher({ className = '' }) {
  const { t, i18n } = useTranslation('common')
  const current = i18n.language?.startsWith('en') ? 'en' : 'es'

  const segment = (lang, labelKey, ariaKey) => (
    <button
      type="button"
      onClick={() => setLanguage(lang)}
      aria-pressed={current === lang}
      aria-label={t(ariaKey)}
      className={`relative z-10 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide transition-colors duration-200 ${
        current === lang ? 'text-pri' : 'text-faint hover:text-muted'
      }`}
    >
      {t(labelKey)}
    </button>
  )

  return (
    <div
      role="group"
      aria-label={t('languageSwitcher.ariaLabel')}
      className={`relative inline-flex items-center rounded-lg border border-border bg-surface p-0.5 ${className}`}
    >
      <motion.span
        className="absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-md bg-pri/12"
        animate={{ x: current === 'es' ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        aria-hidden="true"
      />
      {segment('es', 'languageSwitcher.es', 'languageSwitcher.switchToEs')}
      {segment('en', 'languageSwitcher.en', 'languageSwitcher.switchToEn')}
    </div>
  )
}
