import { createSelector } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import type { LanguageCode } from 'iso-639-1'

import { isCourseRouteInfo } from '@innodoc/routes/typeGuards'
import { selectRouteInfo } from '@innodoc/store/slices/app'
import { useGetCoursePagesQuery } from '@innodoc/store/slices/content/pages'
import { useGetCourseSectionsQuery } from '@innodoc/store/slices/content/sections'
import { isApiPage } from '@innodoc/typeguards/content'
import type { ApiPage, ApiSection } from '@innodoc/schema/types'
import type { ContentType } from '@innodoc/types/common'

import { useSelector } from './redux'
import { translateEntity } from './utils'

/**
 * Make page/section selection hook.
 *
 * @param contentType content type
 * @returns hook to select a page/section
 */
function makeUseSelectContentUnit<T extends ApiPage | ApiSection>(contentType: ContentType) {
  type ContentIdField = T extends ApiPage ? ApiPage['slug'] : ApiSection['path']
  const useGetContentUnitsQuery = contentType === 'page' ? useGetCoursePagesQuery : useGetCourseSectionsQuery

  return (contentId: ContentIdField | undefined) => {
    const routeInfo = useSelector(selectRouteInfo)
    const courseSlug = isCourseRouteInfo(routeInfo) ? routeInfo.courseSlug : undefined

    const selectContentUnit = useMemo(
      () =>
        createSelector(
          [
            (_result: { data: T[] | undefined }) => _result.data,
            (_result, contentIdField: ContentIdField) => contentIdField,
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

    const result = useGetContentUnitsQuery(
      { courseSlug: courseSlug ?? '' },
      {
        selectFromResult: (result) => ({ [contentType]: selectContentUnit(result, contentId, routeInfo.locale) }),
        skip: !courseSlug || !contentId,
      },
    )

    return result
  }
}

export default makeUseSelectContentUnit
