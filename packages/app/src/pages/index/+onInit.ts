import { redirect, render } from 'vike/abort'
import type { PageContextServer } from 'vike/types'

import { DEFAULT_ROUTE_NAME } from '@innodoc/constants'
import getRouteManager from '@innodoc/routes/vite/getRouteManager'
import courses from '@innodoc/store/slices/content/courses'
import type { ApiCourse } from '@innodoc/schema/types'

const routeManager = getRouteManager()

/**
 * Redirect index page `/` to course `homeLink`.
 *
 * @param pageContext current page context
 */
function onInit(pageContext: PageContextServer): void {
  let course: ApiCourse | undefined = undefined

  // TODO

  if (!pageContext.routeInfo.courseSlug) {
    throw render(500, 'No course loaded')
  }

  const { courseSlug } = pageContext.routeInfo

  const selectCurrentCourse = courses.endpoints.getCourse.select({ courseSlug })
  const { data } = selectCurrentCourse(pageContext.store.getState())
  if (data === undefined) {
    throw new Error('No course loaded')
  }
  course = data

  // Prevent a redirect loop
  if (course.homeLink === DEFAULT_ROUTE_NAME) {
    throw render(500, 'Redirect loop detected: app:index cannot redirect to itself')
  }

  const redirectUrl = routeManager.appUrl({
    courseSlug,
    locale: pageContext.routeInfo.locale,
    ...routeManager.parseLinkSpecifier(course.homeLink),
  })

  throw redirect(redirectUrl)
}

export default onInit
