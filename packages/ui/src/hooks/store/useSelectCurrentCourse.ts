import { createSelector } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import type { ApiCourse } from '@innodoc/types/entities'
import type { LanguageCode } from 'iso-639-1'

import { selectRouteInfo } from '@innodoc/store/slices/app'
import { useGetCourseQuery } from '@innodoc/store/slices/content/courses'
import { defaultTranslatableFields } from '@innodoc/types/entities'

import { useSelector } from './redux'
import { translateEntity } from './utils'

/** Return current course */
function useSelectCurrentCourse() {
  const { courseSlug, locale } = useSelector(selectRouteInfo)

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
          return translateEntity(course, [...defaultTranslatableFields, 'description'], _locale)
        }
      ),
    []
  )

  const result = useGetCourseQuery(
    { courseSlug: courseSlug ?? '' },
    {
      selectFromResult: (result) => ({ course: selectCourse(result, locale) }),
      skip: courseSlug === null,
    }
  )

  return result
}

export default useSelectCurrentCourse
