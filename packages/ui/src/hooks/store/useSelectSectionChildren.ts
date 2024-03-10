import { createSelector } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import type { LanguageCode } from 'iso-639-1'

import { isCourseRouteInfo } from '@innodoc/routes/typeGuards'
import { selectRouteInfo } from '@innodoc/store/slices/app'
import { useGetCourseSectionsQuery } from '@innodoc/store/slices/content/sections'
import type { ApiSection, TranslatedSection } from '@innodoc/schema/types'

import { useSelector } from './redux'
import { translateEntityArray } from './utils'

/**
 * Select section's children.
 *
 * @param parentId parent's ID
 * @returns array of sections
 */
function useSelectSectionChildren(parentId: ApiSection['parentId']) {
  const routeInfo = useSelector(selectRouteInfo)
  const courseSlug = isCourseRouteInfo(routeInfo) ? routeInfo.courseSlug : undefined

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
    { courseSlug: courseSlug ?? '' },
    {
      selectFromResult: (result) => ({ sections: selectSectionChildren(result, parentId, routeInfo.locale) }),
      skip: !courseSlug,
    },
  )

  return result
}

export default useSelectSectionChildren
