import { createSelector } from '@reduxjs/toolkit'
import { use, useMemo } from 'react'
import type { LanguageCode } from 'iso-639-1'

import { isCourseRouteInfo } from '@innodoc/shared-core/typeguards'
import { RouteManagerContext } from '@innodoc/ui-shared/contexts'
import type { ApiCourse, TranslatedCourse } from '@innodoc/shared-core/types'

import { selectRouteInfo } from '#slices/app'
import getCoursesApi from '#slices/content/courses'

import { useSelector } from './redux.js'
import { translateEntity } from './utils.js'

/** Select current course */
function useSelectCurrentCourse(): { course?: TranslatedCourse } {
  const routeInfo = useSelector(selectRouteInfo)
  const courseSlug = isCourseRouteInfo(routeInfo) ? routeInfo.courseSlug : undefined
  const routeManager = use(RouteManagerContext)
  const courses = getCoursesApi(routeManager)

  const selectCourse = useMemo(
    () =>
      createSelector(
        [(result: { data: ApiCourse | undefined }) => result.data, (result, locale: LanguageCode) => locale],
        (course, locale) => (course ? translateEntity(course, locale) : undefined),
      ),
    [],
  )

  return courses.useGetCourseQuery(
    { courseSlug: courseSlug ?? '' },
    {
      selectFromResult: (result) => ({ course: selectCourse(result, routeInfo.locale) }),
      skip: !courseSlug,
    },
  )
}

export default useSelectCurrentCourse
