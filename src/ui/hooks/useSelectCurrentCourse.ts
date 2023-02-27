import { createSelector } from '@reduxjs/toolkit'
import type { LanguageCode } from 'iso-639-1'
import { useMemo } from 'react'

import { selectCourseId, selectRouteInfo } from '#store/slices/appSlice'
import { useGetCourseQuery } from '#store/slices/entities/courses'
import { defaultTranslatableFields } from '#types/entities/base'
import type { ApiCourse } from '#types/entities/course'
import { useSelector } from '#ui/hooks/store'
import { translateEntity } from '#utils/i18n'

/** Return current course */
function useSelectCurrentCourse() {
  const { locale } = useSelector(selectRouteInfo)
  const courseId = useSelector(selectCourseId)

  const selectCourse = useMemo(
    () =>
      createSelector(
        [
          (_result: { data: ApiCourse | undefined }) => _result.data,
          (_result, _locale: LanguageCode) => _locale,
        ],
        (course, _locale) => {
          if (course === undefined) return undefined
          return translateEntity(course, [...defaultTranslatableFields, 'description'], _locale)
        }
      ),
    []
  )

  const result = useGetCourseQuery(
    { courseId: courseId ?? 0 },
    {
      selectFromResult: (result) => ({ course: selectCourse(result, locale) }),
      skip: courseId === null,
    }
  )

  return result
}

export default useSelectCurrentCourse
