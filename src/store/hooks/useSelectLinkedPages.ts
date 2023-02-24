import { createSelector } from '@reduxjs/toolkit'
import type { LanguageCode } from 'iso-639-1'
import { useMemo } from 'react'

import { selectCourseId, selectRouteInfo } from '#store/slices/appSlice'
import { useGetCoursePagesQuery } from '#store/slices/entities/pages'
import type { PageLinkLocation } from '#types/common'
import { defaultTranslatableFields } from '#types/entities/base'
import type { ApiPage, TranslatedPage } from '#types/entities/page'
import { useSelector } from '#ui/hooks/store'
import { translateEntityArray } from '#utils/i18n'

/** Return pages for link lists */
function useSelectLinkedPages(linkLocation: PageLinkLocation) {
  const { locale } = useSelector(selectRouteInfo)
  const courseId = useSelector(selectCourseId)

  const selectNavPages = useMemo(() => {
    const emptyArray: TranslatedPage[] = []

    return createSelector(
      [
        (_result: { data: ApiPage[] | undefined }) => _result.data,
        (_result, _locale: LanguageCode) => _locale,
      ],
      (pages, _locale) => {
        if (pages === undefined) return emptyArray
        const linkedPages = pages.filter((p) => (p.linked ?? []).includes(linkLocation))
        return translateEntityArray(linkedPages, defaultTranslatableFields, _locale)
      }
    )
  }, [linkLocation])

  const result = useGetCoursePagesQuery(
    { courseId: courseId ?? 0 },
    {
      selectFromResult: (result) => ({ pages: selectNavPages(result, locale) }),
      skip: courseId === null,
    }
  )

  return result
}

export default useSelectLinkedPages