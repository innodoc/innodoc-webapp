import { DEFAULT_LOCALES } from '@innodoc/constants'
import courses from '@innodoc/store/slices/content/courses'
import type { AppRouteInfo } from '@innodoc/routes/types'
import type { Store } from '@innodoc/store/types'

/**
 * Get course locales from store.
 *
 * @param store App store
 * @param routeInfo Current route info
 * @returns List of locales
 */
function getCourseLocales(store: Store, { courseSlug }: AppRouteInfo) {
  if (courseSlug) {
    const selectCurrentCourse = courses.endpoints.getCourse.select({ courseSlug })
    const { data: course } = selectCurrentCourse(store.getState())
    if (course !== undefined) {
      return course.locales
    }
  }

  return DEFAULT_LOCALES
}

export { getCourseLocales }
