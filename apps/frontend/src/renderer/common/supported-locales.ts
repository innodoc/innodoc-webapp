import type { LanguageCode } from 'iso-639-1'

import { DEFAULT_LOCALES } from '@innodoc/shared-core/constants'
import { isCourseRouteInfo, isLocale } from '@innodoc/shared-core/typeguards'
import courses from '@innodoc/ui-store/slices/content/courses'
import type { AppRouteInfo } from '@innodoc/shared-core/types'
import type { Store } from '@innodoc/ui-store/types'

/**
 * Get supported locales.
 *
 * @param store App store
 * @param routeInfo Current route info
 * @returns List of locales
 */
function getSupportedLocales(store: Store, routeInfo: AppRouteInfo) {
  // Try course locales
  if (isCourseRouteInfo(routeInfo)) {
    const selectCurrentCourse = courses.endpoints.getCourse.select({ courseSlug: routeInfo.courseSlug })
    const { data: course } = selectCurrentCourse(store.getState())
    if (course !== undefined) {
      return course.locales.filter((locale): locale is LanguageCode => isLocale(locale))
    }
  }

  return DEFAULT_LOCALES
}

export default getSupportedLocales
