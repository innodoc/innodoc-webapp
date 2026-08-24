import { Redirect, useLocation } from 'wouter'
import { isCourseRouteInfo } from '@innodoc/shared-core/typeguards'
import { selectRouteInfo } from '@innodoc/shared-store/slices/app'
import getCoursesApi from '@innodoc/shared-store/slices/content/courses'
import { useRouteManager } from '@innodoc/ui-shared/hooks'
import { useSelector } from '@innodoc/ui-shared/store-hooks'

/**
 * Redirect to the course home page.
 *
 * The course index route has no page of its own: the course's `homeLink`
 * (e.g. `app:course:page|home`) determines the actual home URL in all slug
 * modes. Server-side this redirect is a 302; client-side navigations to the
 * course index land here.
 */
function CourseHomeRedirect() {
  const routeManager = useRouteManager()
  const [location] = useLocation()
  const routeInfo = useSelector(selectRouteInfo)
  const courseSlug = isCourseRouteInfo(routeInfo) ? routeInfo.courseSlug : undefined
  const coursesApi = getCoursesApi(routeManager)

  // oxlint-disable-next-line react/react-compiler -- `coursesApi` is cached via `??=` in `getCoursesApi`, hook ref is stable
  const { data: course } = coursesApi.useGetCourseQuery({ courseSlug: courseSlug ?? '' }, { skip: !courseSlug })

  const homeUrl = course ? routeManager.resolveHomeLinkUrl(course.homeLink, routeInfo) : null

  // No redirect target yet (course query pending/skipped) or self-referential
  // home link - render nothing in both cases
  if (!homeUrl || homeUrl === location.replace(/\/+$/u, '')) {
    return null
  }

  return <Redirect to={homeUrl} replace />
}

export default CourseHomeRedirect
