import { createSelector } from '@reduxjs/toolkit'
import { use, useMemo } from 'react'
import type { LanguageCode } from 'iso-639-1'

import { isCourseRouteInfo } from '@innodoc/shared-core/typeguards'
import { RouteManagerContext } from '@innodoc/ui-shared/contexts'
import type { ApiPage, PageLinkLocation, TranslatedPage } from '@innodoc/shared-core/types'

import { selectRouteInfo } from '#slices/app'
import getPagesApi from '#slices/content/pages'

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
  const routeManager = use(RouteManagerContext)
  const pages = getPagesApi(routeManager)

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

  return pages.useGetCoursePagesQuery(
    { courseSlug: courseSlug ?? '' },
    {
      selectFromResult: (result) => ({ pages: selectNavPages(result, routeInfo.locale) }),
      skip: !courseSlug,
    },
  )
}

export default useSelectLinkedPages
