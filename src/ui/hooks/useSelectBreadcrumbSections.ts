import { createSelector } from '@reduxjs/toolkit'
import type { LanguageCode } from 'iso-639-1'
import { useMemo } from 'react'

import { selectRouteInfo } from '#store/slices/appSlice'
import { useGetCourseSectionsQuery } from '#store/slices/entities/sections'
import { defaultTranslatableFields } from '#types/entities/base'
import type { ApiSection, TranslatedSection } from '#types/entities/section'
import { useSelector } from '#ui/hooks/store'
import { translateEntityArray } from '#utils/i18n'

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
  const { courseSlug, locale } = useSelector(selectRouteInfo)
  const { sectionPath } = useSelector(selectRouteInfo)

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
          return sec !== undefined ? [...acc, sec] : acc
        }, [])
        return translateEntityArray(bcSections, defaultTranslatableFields, _locale)
      }
    )
  }, [])

  const result = useGetCourseSectionsQuery(
    { courseSlug: courseSlug ?? '' },
    {
      selectFromResult: (result) => ({
        sections: selectBreadcrumbSections(result, sectionPath, locale),
      }),
      skip: courseSlug === null,
    }
  )

  return result
}

export default useSelectBreadcrumbSections
