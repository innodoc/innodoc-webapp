import { createSelector } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import type { LanguageCode } from 'iso-639-1'

import { isCourseRouteInfo } from '@innodoc/routes/typeGuards'
import { selectRouteInfo } from '@innodoc/store/slices/app'
import { useGetCoursePagesQuery } from '@innodoc/store/slices/content/pages'
import type { ApiPage } from '@innodoc/types/entities'

import { useSelector } from './redux'
import { translateEntity } from './utils'

const empty = { page: undefined }

/** Return page by slug */
function useSelectPage(pageSlug: ApiPage['slug'] | undefined) {
  const routeInfo = useSelector(selectRouteInfo)
  if (!isCourseRouteInfo(routeInfo) || !pageSlug) {
    return empty
  }
  const { courseSlug, locale } = routeInfo

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
            return
          }
          const page = pages.find((p) => p.slug === _pageSlug)
          if (page === undefined) {
            return
          }
          return translateEntity(page, _locale)
        },
      ),
    [],
  )

  const result = useGetCoursePagesQuery(
    { courseSlug },
    { selectFromResult: (result) => ({ page: selectPage(result, pageSlug, locale) }) },
  )

  return result
}

export default useSelectPage
