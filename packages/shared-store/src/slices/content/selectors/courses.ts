import type { RouteManager } from '@innodoc/shared-core/routes'
import type { LanguageCode } from '@innodoc/shared-core/types'
import getCoursesApi from '#slices/content/courses'
import type { RootState } from '#types'

/**
 * The locales the cached course declares, read from the RTK Query cache.
 *
 * `undefined` while the course record is not in the cache: the reader has nothing to check a
 * locale against, and nothing is fetched here - the route navigator, which must correct against
 * the record, fetches it itself before deciding.
 *
 * Deliberately not memoised: `endpoint.select` builds a fresh selector per call, so this is for
 * low-frequency readers (the route navigator, once per navigation), never for render loops.
 */
function selectCourseLocales(
  routeManager: RouteManager,
  state: RootState,
  courseSlug: string,
): readonly LanguageCode[] | undefined {
  const selectCourse = getCoursesApi(routeManager).endpoints.getCourse.select({ courseSlug })
  // The course schema refines every locale to a valid ISO 639-1 code; zod just infers `string`
  return selectCourse(state).data?.locales as LanguageCode[] | undefined
}

export { selectCourseLocales }
