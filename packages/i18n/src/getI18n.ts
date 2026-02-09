import i18next, { type i18n } from 'i18next'
import { initReactI18next } from 'react-i18next'
import type { FsBackendOptions } from 'i18next-fs-backend'
import type { HttpBackendOptions } from 'i18next-http-backend'
import type { LanguageCode } from 'iso-639-1'

const isBrowser = typeof window !== 'undefined'

const NAMESPACE = 'common'

type I18nBackend = Parameters<i18n['use']>[0]

/** i18next instance singleton factory */
async function getI18n(
  backend: I18nBackend,
  backendOpts: FsBackendOptions | HttpBackendOptions,
  currentLocale: LanguageCode | 'cimode',
  supportedLngs: readonly LanguageCode[],
) {
  // i18next as a singleton is reused. Just load translations and update store.
  if (i18next.isInitialized) {
    if (i18next.language !== currentLocale) {
      await i18next.changeLanguage(currentLocale)
    }
    return i18next
  }

  // Initialize i18next
  await i18next
    .use(backend)
    .use(initReactI18next)
    .init({
      backend: backendOpts,
      defaultNS: NAMESPACE,
      fallbackLng: currentLocale,
      interpolation: {
        // Not needed for react as it escapes by default
        escapeValue: false,
      },
      lng: currentLocale,
      load: 'languageOnly', // look-up using two-letter language only
      ns: NAMESPACE,
      preload: [currentLocale],
      saveMissing: !isBrowser && import.meta.env.DEV,
      supportedLngs,
    })

  return i18next
}

export default getI18n
