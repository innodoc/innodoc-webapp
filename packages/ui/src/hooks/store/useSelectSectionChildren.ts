import { createSelector } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import type { ApiSection, TranslatedSection } from '@innodoc/types/entities'
import type { LanguageCode } from 'iso-639-1'

import { selectRouteInfo } from '@innodoc/store/slices/app'
import { useGetCourseSectionsQuery } from '@innodoc/store/slices/content/sections'
import { defaultTranslatableFields } from '@innodoc/types/entities'

import { useSelector } from './redux'
import { translateEntityArray } from './utils'

/** Return sections children */
function useSelectSectionChildren(parentId: ApiSection['parentId']) {
  const { courseSlug, locale } = useSelector(selectRouteInfo)

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
        return translateEntityArray(children, defaultTranslatableFields, _locale)
      }
    )
  }, [])

  const result = useGetCourseSectionsQuery(
    { courseSlug: courseSlug ?? '' },
    {
      selectFromResult: (result) => ({ sections: selectSectionChildren(result, parentId, locale) }),
      skip: courseSlug === null,
    }
  )

  return result
}

export default useSelectSectionChildren
