import { createSelector } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import type { LanguageCode } from 'iso-639-1'

import { isCourseRouteInfo } from '@innodoc/shared-core/routes/typeguards'
import { isApiPage } from '@innodoc/shared-core/typeguards'
import type { ApiPage, ApiSection, TranslatedPage, TranslatedSection } from '@innodoc/shared-core/schemas/types'
import type { ContentType } from '@innodoc/shared-core/types'

import { useGetCoursePagesQuery } from '#slices/content/pages'
import { useGetCourseSectionsQuery } from '#slices/content/sections'
import { selectRouteInfo } from '#slices/app'

import { useSelector } from './redux.js'
import { translateEntity } from './utils.js'

type ContentUnit = ApiPage | ApiSection
type ContentIdField<C extends ContentUnit> = C extends ApiPage ? ApiPage['slug'] : ApiSection['path']
type UseSelectReturnType<C extends ContentUnit> = C extends ApiPage
  ? { page?: TranslatedPage }
  : { section?: TranslatedSection }

/**
 * Make page/section selection hook.
 *
 * @param contentType content type
 * @returns hook that selects a page/section
 */
function makeUseSelectContentUnit<C extends ContentUnit>(contentType: ContentType) {
  const useGetContentUnitsQuery = contentType === 'page' ? useGetCoursePagesQuery : useGetCourseSectionsQuery

  return (contentId: ContentIdField<C> | undefined): UseSelectReturnType<C> => {
    const routeInfo = useSelector(selectRouteInfo)
    const courseSlug = isCourseRouteInfo(routeInfo) ? routeInfo.courseSlug : undefined

    const selectContentUnit = useMemo(
      () =>
        createSelector(
          [
            (_result: { data: C[] | undefined }) => _result.data,
            (_result, contentIdField: ContentIdField<C>) => contentIdField,
            (_result, contentIdField, locale: LanguageCode) => locale,
          ],
          (contentUnits, idField, locale) => {
            if (contentUnits === undefined) {
              return
            }
            const contentUnit = contentUnits.find((u) => (isApiPage(u) ? u.slug : u.path) === idField)
            return contentUnit ? translateEntity(contentUnit, locale) : undefined
          },
        ),
      [],
    )

    return useGetContentUnitsQuery(
      { courseSlug: courseSlug ?? '' },
      {
        selectFromResult: (result) => ({ [contentType]: selectContentUnit(result, contentId, routeInfo.locale) }),
        skip: !courseSlug || !contentId,
      },
    )
  }
}

export default makeUseSelectContentUnit
