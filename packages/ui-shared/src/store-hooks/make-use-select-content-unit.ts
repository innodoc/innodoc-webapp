import type { LanguageCode } from 'iso-639-1'
import { createSelector } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import { isApiPage, isCourseRouteInfo } from '@innodoc/shared-core/typeguards'
import type { ApiPage, ApiSection, ContentType, TranslatedPage, TranslatedSection } from '@innodoc/shared-core/types'
import { selectRouteInfo } from '@innodoc/shared-store/slices/app'
import getPagesApi from '@innodoc/shared-store/slices/content/pages'
import getSectionsApi from '@innodoc/shared-store/slices/content/sections'
import { useRouteManager } from '@innodoc/ui-shared/hooks'
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
  return (contentId: ContentIdField<C> | undefined): UseSelectReturnType<C> => {
    const routeManager = useRouteManager()

    const useGetContentUnitsQuery =
      contentType === 'page'
        ? getPagesApi(routeManager).useGetCoursePagesQuery
        : getSectionsApi(routeManager).useGetCourseSectionsQuery

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
