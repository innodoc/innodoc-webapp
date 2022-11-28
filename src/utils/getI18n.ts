import i18next, { type i18n } from 'i18next'
import type { LanguageCode } from 'iso-639-1'
import { initReactI18next } from 'react-i18next'

import type { Store } from '#store/makeStore'
import courses from '#store/slices/entities/courses'
import type { ApiCourse } from '#types/entities/course'

const isDev = import.meta.env.MODE === 'development'
const isBrowser = typeof window !== 'undefined'

const NAMESPACE = 'common'

/** i18next instance singleton factory */
async function getI18n(
  backend: Parameters<i18n['use']>[0],
  backendOpts: Record<string, unknown>,
  currentLocale: LanguageCode,
  courseId: ApiCourse['id'],
  store: Store
) {
  // i18next as a singleton is reused. Just load translations and update store.
  if (i18next.isInitialized) {
    if (i18next.language !== currentLocale) {
      await i18next.changeLanguage(currentLocale)
    }
    return i18next
  }

  // Select current course
  const selectCurrentCourse = courses.endpoints.getCourse.select({ courseId })
  const { data: course } = selectCurrentCourse(store.getState())
  if (course === undefined) throw new Error(`No course loaded`)

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
      supportedLngs: course.locales,
    })

  return i18next
}

export default getI18n
