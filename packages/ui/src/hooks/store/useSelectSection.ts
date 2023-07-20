import { createSelector } from '@reduxjs/toolkit'
import type { LanguageCode } from 'iso-639-1'
import { useMemo } from 'react'

import { selectRouteInfo } from '@innodoc/store/slices/app'
import { useGetCourseSectionsQuery } from '@innodoc/store/slices/content/sections'
import { defaultTranslatableFields } from '@innodoc/types/entities'
import type { ApiSection } from '@innodoc/types/entities'

import { useSelector } from './store'
import { translateEntity } from './utils'

/** Return section by path */
function useSelectSection(sectionPath: ApiSection['path'] | undefined) {
  const { courseSlug, locale } = useSelector(selectRouteInfo)

  const selectSection = useMemo(
    () =>
      createSelector(
        [
          (_result: { data: ApiSection[] | undefined }) => _result.data,
          (_result, _sectionPath: ApiSection['path']) => _sectionPath,
          (_result, _sectionPath, _locale: LanguageCode) => _locale,
        ],
        (sections, _sectionPath, _locale) => {
          if (sections === undefined) {
            return undefined
          }
          const section = sections.find((p) => p.path === _sectionPath)
          if (section === undefined) {
            return undefined
          }
          return translateEntity(section, defaultTranslatableFields, _locale)
        }
      ),
    []
  )

  const result = useGetCourseSectionsQuery(
    { courseSlug: courseSlug ?? '' },
    {
      selectFromResult: (result) => ({ section: selectSection(result, sectionPath, locale) }),
      skip: courseSlug === null || sectionPath === undefined,
    }
  )

  return result
}

export default useSelectSection
