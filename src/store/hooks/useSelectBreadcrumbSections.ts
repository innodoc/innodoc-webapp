import { createSelector } from '@reduxjs/toolkit'
import type { LanguageCode } from 'iso-639-1'
import { useMemo } from 'react'

import { useGetCourseSectionsQuery } from '#store/slices/entities/sections'
import { selectCourseId, selectCurrentSectionPath, selectLocale } from '#store/slices/uiSlice'
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
  const courseId = useSelector(selectCourseId)
  const sectionPath = useSelector(selectCurrentSectionPath)
  const sectionSlug = sectionPath !== null ? sectionPath.split('/').pop() : undefined

  const selectBreadcrumbSections = useMemo(() => {
    const emptyArray: TranslatedSection[] = []

    return createSelector(
      [
        (result: { data: ApiSection[] | undefined }) => result.data,
        (result, _sectionSlug: ApiSection['slug'] | undefined) => _sectionSlug,
        (result, _sectionSlug, _locale: LanguageCode) => _locale,
      ],
      (sections, _sectionSlug, _locale) => {
        if (sections === undefined || _sectionSlug === undefined) return emptyArray
        const section = sections.find((s) => s.slug === _sectionSlug)
        if (section === undefined) return emptyArray
        const parts = section.path.split('/')
        const bcSections = parts.reduce((acc, slug, idx) => {
          const _path = parts.slice(0, idx + 1).join('/')
          const sec = sections.find((s) => s.path === _path)
          return sec !== undefined ? [...acc, sec] : acc
        }, [] as ApiSection[])
        return translateEntityArray(bcSections, defaultTranslatableFields, _locale)
      }
    )
  }, [])

  const result = useGetCourseSectionsQuery(
    { courseId: courseId ?? 0 },
    {
      selectFromResult: (result) => ({
        sections: selectBreadcrumbSections(result, sectionSlug, locale),
      }),
      skip: courseId === null,
    }
  )

  return result
}

export default useSelectBreadcrumbSections
