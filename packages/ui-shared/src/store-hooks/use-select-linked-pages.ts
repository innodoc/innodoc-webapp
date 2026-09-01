import type { LanguageCode } from 'iso-639-1'
import { createSelector } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import { translateEntityArray } from '@innodoc/shared-core/translate'
import { isCourseRouteInfo } from '@innodoc/shared-core/typeguards'
import type { ApiPage, PageLinkLocation, TranslatedPage } from '@innodoc/shared-core/types'
import { selectRouteInfo } from '@innodoc/shared-store/slices/app'
import getPagesApi from '@innodoc/shared-store/slices/content/pages'
import { useRouteManager } from '@innodoc/ui-shared/hooks'
import { useSelector } from './redux.js'

/**
 * Select pages for link lists.
 *
 * @param linkLocation page location for links
 * @returns array of pages
 */
function useSelectLinkedPages(linkLocation: PageLinkLocation): { pages: TranslatedPage[] } {
  const routeInfo = useSelector(selectRouteInfo)
  const courseSlug = isCourseRouteInfo(routeInfo) ? routeInfo.courseSlug : undefined
  const routeManager = useRouteManager()
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

  // oxlint-disable-next-line react/react-compiler -- `pages` is cached via `??=` in `getPagesApi`, hook ref is stable
  return pages.useGetCoursePagesQuery(
    { courseSlug: courseSlug ?? '' },
    {
      selectFromResult: (result) => ({ pages: selectNavPages(result, routeInfo.locale) }),
      skip: !courseSlug,
    },
  )
}

export default useSelectLinkedPages
