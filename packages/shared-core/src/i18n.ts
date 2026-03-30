import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import type { i18n, InitOptions } from 'i18next'
// import type { LanguageCode } from 'iso-639-1'

// const isBrowser = globalThis.window !== undefined

const NAMESPACE = 'common'

type I18nModule = Parameters<i18n['use']>[0]

/** i18next instance singleton factory */
async function initI18n(
  modules: I18nModule[],
  initOpts: Partial<InitOptions> = {},
  // backendOpts: FsBackendOptions | HttpBackendOptions,
  // currentLocale: LanguageCode | 'cimode',
  // supportedLngs: readonly LanguageCode[],
): Promise<typeof i18next> {
  // i18next as a singleton is reused. Just load translations and update store.
  // if (i18next.isInitialized) {
  //   if (i18next.language !== currentLocale) {
  //     await i18next.changeLanguage(currentLocale)
  //   }
  //   return i18next
  // }

  const instance = i18next.createInstance()

  for (const module of modules) {
    instance.use(module)
  }

  instance.use(initReactI18next)

  await instance.init({
    // backend: backendOpts,
    defaultNS: NAMESPACE,
    // fallbackLng: currentLocale,
    interpolation: {
      // Not needed for react as it escapes by default
      escapeValue: false,
    },
    // lng: currentLocale,
    load: 'languageOnly', // look-up using two-letter language only
    ns: NAMESPACE,
    // preload: [currentLocale],
    // supportedLngs,
    ...initOpts,
  })

  return instance
}

export default initI18n
