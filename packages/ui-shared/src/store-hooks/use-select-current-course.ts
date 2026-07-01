import type { LanguageCode } from 'iso-639-1'
import { createSelector } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import { isCourseRouteInfo } from '@innodoc/shared-core/typeguards'
import type { ApiCourse, TranslatedCourse } from '@innodoc/shared-core/types'
import { selectRouteInfo } from '@innodoc/shared-store/slices/app'
import getCoursesApi from '@innodoc/shared-store/slices/content/courses'
import { useRouteManager } from '@innodoc/ui-shared/hooks'
import { useSelector } from './redux.js'
import { translateEntity } from './utils.js'

/** Select current course */
function useSelectCurrentCourse(): { course?: TranslatedCourse } {
  const routeInfo = useSelector(selectRouteInfo)
  const courseSlug = isCourseRouteInfo(routeInfo) ? routeInfo.courseSlug : undefined
  const routeManager = useRouteManager()
  const courses = getCoursesApi(routeManager)

  const selectCourse = useMemo(
    () =>
      createSelector(
        [(result: { data: ApiCourse | undefined }) => result.data, (result, locale: LanguageCode) => locale],
        (course, locale) => (course ? translateEntity(course, locale) : undefined),
      ),
    [],
  )

  // oxlint-disable-next-line react/react-compiler -- `courses` is cached via `??=` in `getCoursesApi`, hook ref is stable
  return courses.useGetCourseQuery(
    { courseSlug: courseSlug ?? '' },
    {
      selectFromResult: (result) => ({ course: selectCourse(result, routeInfo.locale) }),
      skip: !courseSlug,
    },
  )
}

export default useSelectCurrentCourse
