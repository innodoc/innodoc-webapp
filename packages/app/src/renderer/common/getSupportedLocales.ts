import { DEFAULT_LOCALES } from '@innodoc/constants'
import { isCourseRouteInfo } from '@innodoc/routes/typeGuards'
import courses from '@innodoc/store/slices/content/courses'
import type { AppRouteInfo } from '@innodoc/routes/types/routeInfos'
import type { Store } from '@innodoc/store/types'

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
    const selectCurrentCourse = courses.endpoints.getCourse.select({
      courseSlug: routeInfo.courseSlug,
    })
    const { data: course } = selectCurrentCourse(store.getState())
    if (course !== undefined) {
      return course.locales
    }
  }

  return DEFAULT_LOCALES
}

export default getSupportedLocales
