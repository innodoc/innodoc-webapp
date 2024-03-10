import { createSelector } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import type { LanguageCode } from 'iso-639-1'

import { isCourseRouteInfo } from '@innodoc/routes/typeGuards'
import { selectRouteInfo } from '@innodoc/store/slices/app'
import { useGetCourseQuery } from '@innodoc/store/slices/content/courses'
import type { ApiCourse, TranslatedCourse } from '@innodoc/schema/types'

import { useSelector } from './redux'
import { translateEntity } from './utils'

/** Select current course */
function useSelectCurrentCourse(): { course?: TranslatedCourse } {
  const routeInfo = useSelector(selectRouteInfo)
  const courseSlug = isCourseRouteInfo(routeInfo) ? routeInfo.courseSlug : undefined

  const selectCourse = useMemo(
    () =>
      createSelector(
        [(result: { data: ApiCourse | undefined }) => result.data, (result, locale: LanguageCode) => locale],
        (course, locale) => (course ? translateEntity(course, locale) : undefined),
      ),
    [],
  )

  const result = useGetCourseQuery(
    { courseSlug: courseSlug ?? '' },
    {
      selectFromResult: (result) => ({ course: selectCourse(result, routeInfo.locale) }),
      skip: !courseSlug,
    },
  )

  return result
}

export default useSelectCurrentCourse
