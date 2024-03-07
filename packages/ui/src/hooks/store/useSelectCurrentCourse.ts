import { createSelector } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import type { LanguageCode } from 'iso-639-1'

import { isCourseRouteInfo } from '@innodoc/routes/typeGuards'
import { selectRouteInfo } from '@innodoc/store/slices/app'
import { useGetCourseQuery } from '@innodoc/store/slices/content/courses'
import type { ApiCourse } from '@innodoc/types/entities'

import { useSelector } from './redux'
import { translateEntity } from './utils'

const empty = { course: undefined }

/** Return current course */
function useSelectCurrentCourse() {
  const routeInfo = useSelector(selectRouteInfo)
  if (!isCourseRouteInfo(routeInfo)) {
    return empty
  }
  const { courseSlug, locale } = routeInfo

  const selectCourse = useMemo(
    () =>
      createSelector(
        [
          (_result: { data: ApiCourse | undefined }) => _result.data,
          (_result, _locale: LanguageCode) => _locale,
        ],
        (course, _locale) => {
          if (course === undefined) {
            return undefined
          }
          return translateEntity(course, _locale)
        },
      ),
    [],
  )

  const result = useGetCourseQuery(
    { courseSlug },
    { selectFromResult: (result) => ({ course: selectCourse(result, locale) }) },
  )

  return result
}

export default useSelectCurrentCourse
