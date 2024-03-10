import { redirect, render } from 'vike/abort'
import type { PageContextServer } from 'vike/types'

import { DEFAULT_ROUTE_NAME } from '@innodoc/constants'
import { isCourseRouteInfo } from '@innodoc/routes/typeGuards'
import getRouteManager from '@innodoc/routes/vite/getRouteManager'
import courses from '@innodoc/store/slices/content/courses'

const routeManager = getRouteManager()

/**
 * Redirect course index to course `homeLink`.
 *
 * @param pageContext current page context
 */
function onInit({ routeInfo, store }: PageContextServer): void {
  if (!isCourseRouteInfo(routeInfo)) {
    throw render(500, 'Not a course route')
  }
  const { courseSlug, locale } = routeInfo

  const selectCurrentCourse = courses.endpoints.getCourse.select({ courseSlug })
  const { data: course } = selectCurrentCourse(store.getState())
  if (!course) {
    throw new Error('No course loaded')
  }

  // Prevent a redirect loop
  if (course.homeLink === DEFAULT_ROUTE_NAME) {
    throw render(500, `Redirect loop detected: ${routeInfo.name} cannot redirect to itself`)
  }

  // Redirect to home link
  try {
    const redirectRouteInfo = { ...routeManager.parseLinkSpecifier(course.homeLink), courseSlug, locale }
    throw redirect(routeManager.appUrl(redirectRouteInfo))
  } catch {
    throw render(500, 'Invalid home link')
  }
}

export default onInit
