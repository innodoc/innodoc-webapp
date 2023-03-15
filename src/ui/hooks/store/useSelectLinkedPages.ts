import { createSelector } from '@reduxjs/toolkit'
import type { LanguageCode } from 'iso-639-1'
import { useMemo } from 'react'

import { selectRouteInfo } from '#store/slices/appSlice'
import { useGetCoursePagesQuery } from '#store/slices/entities/pages'
import type { PageLinkLocation } from '#types/common'
import { defaultTranslatableFields } from '#types/entities/base'
import type { ApiPage, TranslatedPage } from '#types/entities/page'
import { translateEntityArray } from '#utils/i18n'

import { useSelector } from './store'

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
