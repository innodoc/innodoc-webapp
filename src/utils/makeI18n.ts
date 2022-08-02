import i18next, { i18n } from 'i18next'
import { initReactI18next } from 'react-i18next'

import type { Store } from '@/store/makeStore'
import { selectLocales } from '@/store/selectors/content'
import { changeLocale } from '@/store/slices/uiSlice'
import type { Locale } from '@/types/common'

const isDev = import.meta.env.MODE === 'development'
const isBrowser = typeof window !== 'undefined'

const NAMESPACE = 'common'

async function makeI18n(
  backend: Parameters<i18n['use']>[0],
  backendOpts: Record<string, unknown>,
  currentLocale: Locale,
  store: Store
) {
  // i18next is used as a singleton
  if (i18next.isInitialized) {
    return i18next
  }

  // Setup event listener that sync's i18next locale to redux store
  i18next.on('languageChanged', (lng) => {
    store.dispatch(changeLocale(lng))
  })

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
      saveMissing: !isBrowser && isDev,
      supportedLngs: selectLocales(store.getState()),
    })

  return i18next
}

export default makeI18n
