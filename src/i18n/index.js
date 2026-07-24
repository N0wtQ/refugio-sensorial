import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import commonEs from './locales/es/common.json'
import navEs from './locales/es/nav.json'
import catalogEs from './locales/es/catalog.json'
import espaciosEs from './locales/es/espacios.json'
import contactEs from './locales/es/contact.json'
import landingEs from './locales/es/landing.json'
import pagesEs from './locales/es/pages.json'

import commonEn from './locales/en/common.json'
import navEn from './locales/en/nav.json'
import catalogEn from './locales/en/catalog.json'
import espaciosEn from './locales/en/espacios.json'
import contactEn from './locales/en/contact.json'
import landingEn from './locales/en/landing.json'
import pagesEn from './locales/en/pages.json'

// Resources are imported statically (no i18next-http-backend) so init() is
// synchronous — no flash of untranslated content on first paint, and no need
// to relax the CSP's connect-src to fetch locale JSON at runtime.
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { common: commonEs, nav: navEs, catalog: catalogEs, espacios: espaciosEs, contact: contactEs, landing: landingEs, pages: pagesEs },
      en: { common: commonEn, nav: navEn, catalog: catalogEn, espacios: espaciosEn, contact: contactEn, landing: landingEn, pages: pagesEn },
    },
    fallbackLng: 'es',
    supportedLngs: ['es', 'en'],
    load: 'languageOnly', // navigator.language may be "en-US" — match it to our "en" resource bundle
    defaultNS: 'common',
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'refugio-sensorial-lang',
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
    returnEmptyString: false,
  })

document.documentElement.lang = i18n.language?.startsWith('en') ? 'en' : 'es'
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng?.startsWith('en') ? 'en' : 'es'
})

export function setLanguage(lang) {
  i18n.changeLanguage(lang)
}

export default i18n
