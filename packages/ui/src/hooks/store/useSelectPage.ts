import { createSelector } from '@reduxjs/toolkit'
import type { LanguageCode } from 'iso-639-1'
import { useMemo } from 'react'

import { selectRouteInfo } from '@innodoc/store/slices/app'
import { useGetCoursePagesQuery } from '@innodoc/store/slices/content/pages'
import { defaultTranslatableFields } from '@innodoc/types/entities'
import type { ApiPage } from '@innodoc/types/entities'

import { useSelector } from './store'
import { translateEntity } from './utils'

/** Return page by slug */
function useSelectPage(pageSlug: ApiPage['slug'] | undefined) {
  const { courseSlug, locale } = useSelector(selectRouteInfo)

  const selectPage = useMemo(
    () =>
      createSelector(
        [
          (_result: { data: ApiPage[] | undefined }) => _result.data,
          (_result, _pageSlug: ApiPage['slug']) => _pageSlug,
          (result, _pageSlug, _locale: LanguageCode) => _locale,
        ],
        (pages, _pageSlug, _locale) => {
          if (pages === undefined) {
            return undefined
          }
          const page = pages.find((p) => p.slug === _pageSlug)
          if (page === undefined) {
            return undefined
          }
          return translateEntity(page, defaultTranslatableFields, _locale)
        }
      ),
    []
  )

  const result = useGetCoursePagesQuery(
    { courseSlug: courseSlug ?? '' },
    {
      selectFromResult: (result) => ({ page: selectPage(result, pageSlug, locale) }),
      skip: courseSlug === null,
    }
  )

  return result
}

export default useSelectPage
