import i18next, { type i18n } from 'i18next'
import type { FsBackendOptions } from 'i18next-fs-backend'
import type { HttpBackendOptions } from 'i18next-http-backend'
import type { LanguageCode } from 'iso-639-1'
import { initReactI18next } from 'react-i18next'

import type { Store } from '#store/makeStore'
import courses from '#store/slices/entities/courses'
import type { ApiCourse } from '#types/entities/course'

const isBrowser = typeof window !== 'undefined'

const NAMESPACE = 'common'

type I18nBackend = Parameters<i18n['use']>[0]

/** i18next instance singleton factory */
async function getI18n(
  backend: I18nBackend,
  backendOpts: FsBackendOptions | HttpBackendOptions,
  currentLocale: LanguageCode | 'cimode',
  courseSlug: ApiCourse['slug'] | null,
  store: Store
) {
  let course: ApiCourse | undefined = undefined

  // i18next as a singleton is reused. Just load translations and update store.
  if (i18next.isInitialized) {
    if (i18next.language !== currentLocale) {
      await i18next.changeLanguage(currentLocale)
    }
    return i18next
  }

  // Select current course
  if (courseSlug !== null) {
    const selectCurrentCourse = courses.endpoints.getCourse.select({ courseSlug })
    const { data } = selectCurrentCourse(store.getState())
    if (data !== undefined) {
      course = data
    }
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
      supportedLngs: course !== undefined ? course.locales : [],
    })

  return i18next
}

export default getI18n
