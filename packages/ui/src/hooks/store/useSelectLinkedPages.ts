import { createSelector } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import type { LanguageCode } from 'iso-639-1'

import { isCourseRouteInfo } from '@innodoc/routes/typeGuards'
import { selectRouteInfo } from '@innodoc/store/slices/app'
import { useGetCoursePagesQuery } from '@innodoc/store/slices/content/pages'
import type { PageLinkLocation } from '@innodoc/types/common'
import type { ApiPage, TranslatedPage } from '@innodoc/types/entities'

import { useSelector } from './redux'
import { translateEntityArray } from './utils'

const empty = { pages: [] }

/** Return pages for link lists */
function useSelectLinkedPages(linkLocation: PageLinkLocation) {
  const routeInfo = useSelector(selectRouteInfo)
  if (!isCourseRouteInfo(routeInfo)) {
    return empty
  }
  const { courseSlug, locale } = routeInfo

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

  const result = useGetCoursePagesQuery(
    { courseSlug },
    { selectFromResult: (result) => ({ pages: selectNavPages(result, locale) }) },
  )

  return result
}

export default useSelectLinkedPages
