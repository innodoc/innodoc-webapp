import { createSelector } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import type { LanguageCode } from 'iso-639-1'

import { isCourseRouteInfo } from '@innodoc/shared-core/routes/typeguards'
import type { ApiPage, TranslatedPage } from '@innodoc/shared-core/schemas/types'
import type { PageLinkLocation } from '@innodoc/shared-core/types/common'

import { useGetCoursePagesQuery } from '#slices/content/pages'
import { selectRouteInfo } from '#slices/app'

import { useSelector } from './redux.js'
import { translateEntityArray } from './utils.js'

/**
 * Select pages for link lists.
 *
 * @param linkLocation page location for links
 * @returns array of pages
 */
function useSelectLinkedPages(linkLocation: PageLinkLocation): { pages: TranslatedPage[] } {
  const routeInfo = useSelector(selectRouteInfo)
  const courseSlug = isCourseRouteInfo(routeInfo) ? routeInfo.courseSlug : undefined

  const selectNavPages = useMemo(() => {
    const emptyArray: TranslatedPage[] = []

    return createSelector(
      [(_result: { data: ApiPage[] | undefined }) => _result.data, (_result, _locale: LanguageCode) => _locale],
      (pages, _locale) => {
        if (pages === undefined) {
          return emptyArray
        }
        const linkedPages = pages.filter((p) => (p.linked ?? []).includes(linkLocation))
        return translateEntityArray(linkedPages, _locale)
      },
    )
  }, [linkLocation])

  return useGetCoursePagesQuery(
    { courseSlug: courseSlug ?? '' },
    {
      selectFromResult: (result) => ({ pages: selectNavPages(result, routeInfo.locale) }),
      skip: !courseSlug,
    },
  )
}

export default useSelectLinkedPages
