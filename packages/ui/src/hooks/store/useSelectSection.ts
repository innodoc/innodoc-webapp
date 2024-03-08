import { createSelector } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import type { LanguageCode } from 'iso-639-1'

import { isCourseRouteInfo } from '@innodoc/routes/typeGuards'
import { selectRouteInfo } from '@innodoc/store/slices/app'
import { useGetCourseSectionsQuery } from '@innodoc/store/slices/content/sections'
import type { ApiSection } from '@innodoc/types/entities'

import { useSelector } from './redux'
import { translateEntity } from './utils'

const empty = { section: undefined }

/** Return section by path */
function useSelectSection(sectionPath: ApiSection['path'] | undefined) {
  const routeInfo = useSelector(selectRouteInfo)
  if (!isCourseRouteInfo(routeInfo) || !sectionPath) {
    return empty
  }
  const { courseSlug, locale } = routeInfo

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
            return
          }
          const section = sections.find((p) => p.path === _sectionPath)
          if (section === undefined) {
            return
          }
          return translateEntity(section, _locale)
        },
      ),
    [],
  )

  const result = useGetCourseSectionsQuery(
    { courseSlug },
    { selectFromResult: (result) => ({ section: selectSection(result, sectionPath, locale) }) },
  )

  return result
}

export default useSelectSection
