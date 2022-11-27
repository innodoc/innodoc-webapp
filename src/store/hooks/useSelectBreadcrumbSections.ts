import { createSelector } from '@reduxjs/toolkit'
import type { LanguageCode } from 'iso-639-1'
import { useMemo } from 'react'

import { useGetCourseSectionsQuery } from '#store/slices/entities/sections'
import { selectCourseName, selectCurrentSectionPath, selectLocale } from '#store/slices/uiSlice'
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
  const locale = useSelector(selectLocale)
  const courseName = useSelector(selectCourseName)
  const sectionPath = useSelector(selectCurrentSectionPath)
  const sectionName = sectionPath !== undefined ? sectionPath.split('/').pop() : undefined

  const selectBreadcrumbSections = useMemo(() => {
    const emptyArray: TranslatedSection[] = []

    return createSelector(
      [
        (result: { data: ApiSection[] | undefined }) => result.data,
        (result, _sectionName: ApiSection['name'] | undefined) => _sectionName,
        (result, _sectionName, _locale: LanguageCode) => _locale,
      ],
      (sections, _sectionName, _locale) => {
        if (sections === undefined || _sectionName === undefined) return emptyArray
        const section = sections.find((s) => s.name === _sectionName)
        if (section === undefined) return emptyArray
        const parts = section.path.split('/')
        const bcSections = parts.reduce((acc, name, idx) => {
          const _path = parts.slice(0, idx + 1).join('/')
          const sec = sections.find((s) => s.path === _path)
          return sec !== undefined ? [...acc, sec] : acc
        }, [] as ApiSection[])
        return translateEntityArray(bcSections, defaultTranslatableFields, _locale)
      }
    )
  }, [])

  const result = useGetCourseSectionsQuery(
    { courseName: courseName ?? '' },
    {
      selectFromResult: (result) => ({
        sections: selectBreadcrumbSections(result, sectionName, locale),
      }),
      skip: courseName === null,
    }
  )

  return result
}

export default useSelectBreadcrumbSections
