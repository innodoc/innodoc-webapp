import { createSelector } from '@reduxjs/toolkit'
import type { LanguageCode } from 'iso-639-1'
import { useMemo } from 'react'

import { useGetCoursePagesQuery } from '#store/slices/entities/pages'
import { selectCourseId, selectLocale } from '#store/slices/uiSlice'
import { defaultTranslatableFields } from '#types/entities/base'
import type { ApiPage } from '#types/entities/page'
import { useSelector } from '#ui/hooks/store'
import { translateEntity } from '#utils/i18n'

/** Return page by slug */
function useSelectPage(pageSlug: ApiPage['slug'] | null) {
  const locale = useSelector(selectLocale)
  const courseId = useSelector(selectCourseId)

  const selectPage = useMemo(
    () =>
      createSelector(
        [
          (_result: { data: ApiPage[] | undefined }) => _result.data,
          (_result, _pageSlug: ApiPage['slug']) => _pageSlug,
          (result, _pageSlug, _locale: LanguageCode) => _locale,
        ],
        (pages, _pageSlug, _locale) => {
          if (pages === undefined) return undefined
          const page = pages.find((p) => p.slug === _pageSlug)
          if (page === undefined) return undefined
          return translateEntity(page, defaultTranslatableFields, _locale)
        }
      ),
    []
  )

  const result = useGetCoursePagesQuery(
    { courseId: courseId ?? 0 },
    {
      selectFromResult: (result) => ({ page: selectPage(result, pageSlug, locale) }),
      skip: courseId === null,
    }
  )

  return result
}

export default useSelectPage
