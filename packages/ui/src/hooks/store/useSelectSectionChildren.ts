import { createSelector } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import type { LanguageCode } from 'iso-639-1'

import { isCourseRouteInfo } from '@innodoc/routes/typeGuards'
import { selectRouteInfo } from '@innodoc/store/slices/app'
import { useGetCourseSectionsQuery } from '@innodoc/store/slices/content/sections'
import type { ApiSection, TranslatedSection } from '@innodoc/types/entities'

import { useSelector } from './redux'
import { translateEntityArray } from './utils'

const empty = { sections: [] }

/** Return sections children */
function useSelectSectionChildren(parentId: ApiSection['parentId']) {
  const routeInfo = useSelector(selectRouteInfo)
  if (!isCourseRouteInfo(routeInfo)) {
    return empty
  }
  const { courseSlug, locale } = routeInfo

  const selectSectionChildren = useMemo(() => {
    const emptyArray: TranslatedSection[] = []

    return createSelector(
      [
        (result: { data: ApiSection[] | undefined }) => result.data,
        (result, _parentId: ApiSection['parentId']) => _parentId,
        (result, _parentId, _locale: LanguageCode) => _locale,
      ],
      (sections, _parentId, _locale) => {
        if (sections === undefined) {
          return emptyArray
        }
        const children = sections.filter((s) => s.parentId === _parentId)
        return translateEntityArray(children, _locale)
      },
    )
  }, [])

  const result = useGetCourseSectionsQuery(
    { courseSlug },
    {
      selectFromResult: (result) => ({ sections: selectSectionChildren(result, parentId, locale) }),
    },
  )

  return result
}

export default useSelectSectionChildren
