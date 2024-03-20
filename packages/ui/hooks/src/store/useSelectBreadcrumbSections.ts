import { createSelector } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import type { LanguageCode } from 'iso-639-1'

import { isCourseSectionRouteInfo } from '@innodoc/routes/typeGuards'
import { selectRouteInfo } from '@innodoc/store/slices/app'
import { useGetCourseSectionsQuery } from '@innodoc/store/slices/content/sections'
import type { ApiSection, TranslatedSection } from '@innodoc/schema/types'

import { useSelector } from './redux.js'
import { translateEntityArray } from './utils.js'

/**
 * Create section data for the Breadcrumb component. E.g.:
 * ```
 * [
 *  { path: 'foo', ... },
 *  { path: 'foo/bar', ... },
 *  { path: 'foo/bar/baz', ... },
 * ]
 * ```
 *
 * @returns Array of sections
 */
function useSelectBreadcrumbSections(): { sections: TranslatedSection[] } {
  const routeInfo = useSelector(selectRouteInfo)
  const { courseSlug, sectionPath } = isCourseSectionRouteInfo(routeInfo)
    ? routeInfo
    : { courseSlug: undefined, sectionPath: undefined }

  const selectBreadcrumbSections = useMemo(() => {
    const emptyArray: TranslatedSection[] = []

    return createSelector(
      [
        (result: { data: ApiSection[] | undefined }) => result.data,
        (result, _sectionPath: string | null) => _sectionPath,
        (result, _sectionPath, locale: LanguageCode) => locale,
      ],
      (sections, _sectionPath, locale) => {
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
        return translateEntityArray(bcSections, locale)
      },
    )
  }, [])

  return useGetCourseSectionsQuery(
    { courseSlug: courseSlug ?? '' },
    {
      selectFromResult: (result) => ({ sections: selectBreadcrumbSections(result, sectionPath, routeInfo.locale) }),
      skip: !courseSlug || !sectionPath,
    },
  )
}

export default useSelectBreadcrumbSections
