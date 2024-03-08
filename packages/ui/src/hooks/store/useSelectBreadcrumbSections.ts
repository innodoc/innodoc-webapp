import { createSelector } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import type { LanguageCode } from 'iso-639-1'

import { isCourseSectionRouteInfo } from '@innodoc/routes/typeGuards'
import { selectRouteInfo } from '@innodoc/store/slices/app'
import { useGetCourseSectionsQuery } from '@innodoc/store/slices/content/sections'
import type { ApiSection, TranslatedSection } from '@innodoc/types/entities'

import { useSelector } from './redux'
import { translateEntityArray } from './utils'

const empty = { sections: [] }

/**
 * Return an array of sections for the Breadcrumb component. E.g.:
 * ```
 * [
 *  { path: 'foo', ... },
 *  { path: 'foo/bar', ... },
 *  { path: 'foo/bar/baz', ... },
 * ]
 * ```
 */
function useSelectBreadcrumbSections() {
  const routeInfo = useSelector(selectRouteInfo)
  if (!isCourseSectionRouteInfo(routeInfo)) {
    return empty
  }
  const { courseSlug, locale, sectionPath } = routeInfo

  const selectBreadcrumbSections = useMemo(() => {
    const emptyArray: TranslatedSection[] = []

    return createSelector(
      [
        (result: { data: ApiSection[] | undefined }) => result.data,
        (result, _sectionPath: string | null) => _sectionPath,
        (result, _sectionPath, _locale: LanguageCode) => _locale,
      ],
      (sections, _sectionPath, _locale) => {
        if (sections === undefined || _sectionPath === null) {
          return emptyArray
        }

        const section = sections.find((s) => s.path === _sectionPath)
        if (section === undefined) {
          return emptyArray
        }

        const parts = section.path.split('/')
        const bcSections = parts.reduce<ApiSection[]>((acc, _, idx) => {
          const _path = parts.slice(0, idx + 1).join('/')
          const sec = sections.find((s) => s.path === _path)
          return sec === undefined ? acc : [...acc, sec]
        }, [])
        return translateEntityArray(bcSections, _locale)
      },
    )
  }, [])

  const result = useGetCourseSectionsQuery(
    { courseSlug },
    {
      selectFromResult: (result) => ({
        sections: selectBreadcrumbSections(result, sectionPath, locale),
      }),
    },
  )

  return result
}

export default useSelectBreadcrumbSections
