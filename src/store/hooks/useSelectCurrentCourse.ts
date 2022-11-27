import { createSelector } from '@reduxjs/toolkit'
import type { LanguageCode } from 'iso-639-1'
import { useMemo } from 'react'

import { useGetCourseByNameQuery } from '#store/slices/entities/courses'
import { selectCourseName, selectLocale } from '#store/slices/uiSlice'
import { defaultTranslatableFields } from '#types/entities/base'
import type { ApiCourse } from '#types/entities/course'
import { useSelector } from '#ui/hooks/store'
import { translateEntity } from '#utils/i18n'

/** Return current course */
function useSelectCurrentCourse() {
  const locale = useSelector(selectLocale)
  const courseName = useSelector(selectCourseName)

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

  const result = useGetCourseByNameQuery(
    { courseName: courseName ?? '' },
    {
      selectFromResult: (result) => ({ course: selectCourse(result, locale) }),
      skip: courseName === null,
    }
  )

  return result
}

export default useSelectCurrentCourse
