import { createSelector } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import type { PageLinkLocation } from '@innodoc/types/common'
import type { ApiPage, TranslatedPage } from '@innodoc/types/entities'
import type { LanguageCode } from 'iso-639-1'

import { selectRouteInfo } from '@innodoc/store/slices/app'
import { useGetCoursePagesQuery } from '@innodoc/store/slices/content/pages'
import { defaultTranslatableFields } from '@innodoc/types/entities'

import { useSelector } from './store'
import { translateEntityArray } from './utils'

/** Return pages for link lists */
function useSelectLinkedPages(linkLocation: PageLinkLocation) {
  const { courseSlug, locale } = useSelector(selectRouteInfo)

  const selectNavPages = useMemo(() => {
    const emptyArray: TranslatedPage[] = []

    return createSelector(
      [
        (_result: { data: ApiPage[] | undefined }) => _result.data,
        (_result, _locale: LanguageCode) => _locale,
      ],
      (pages, _locale) => {
        if (pages === undefined) {
          return emptyArray
        }
        const linkedPages = pages.filter((p) => (p.linked ?? []).includes(linkLocation))
        return translateEntityArray(linkedPages, defaultTranslatableFields, _locale)
      }
    )
  }, [linkLocation])

  const result = useGetCoursePagesQuery(
    { courseSlug: courseSlug ?? '' },
    {
      selectFromResult: (result) => ({ pages: selectNavPages(result, locale) }),
      skip: courseSlug === null,
    }
  )

  return result
}

export default useSelectLinkedPages
