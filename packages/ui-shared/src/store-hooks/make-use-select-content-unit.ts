import { isCourseRouteInfo } from '@innodoc/shared-core/typeguards'
import type { ApiPage, ApiSection, ContentType, TranslatedPage, TranslatedSection } from '@innodoc/shared-core/types'
import { selectRouteInfo } from '@innodoc/shared-store/slices/app'
import getPagesApi from '@innodoc/shared-store/slices/content/pages'
import getSectionsApi from '@innodoc/shared-store/slices/content/sections'
import { selectPageBySlug } from '@innodoc/shared-store/slices/content/selectors/pages'
import { selectSectionByPath } from '@innodoc/shared-store/slices/content/selectors/sections'
import { useRouteManager } from '@innodoc/ui-shared/hooks'
import { useSelector } from './redux.js'

type ContentUnit = ApiPage | ApiSection
type ContentIdField<C extends ContentUnit> = C extends ApiPage ? ApiPage['slug'] : ApiSection['path']
type UseSelectReturnType<C extends ContentUnit> = C extends ApiPage
  ? { page?: TranslatedPage }
  : { section?: TranslatedSection }

/**
 * Make page/section selection hook.
 *
 * The unit is looked up in the shared translated index (`selectPageBySlug` / `selectSectionByPath`
 * in `@innodoc/shared-store`): no per-link `find()` over the whole array, and no selector built
 * per component instance.
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

    return useGetContentUnitsQuery(
      { courseSlug: courseSlug ?? '' },
      {
        selectFromResult: (result) => {
          // `result.data` is typed by whichever of the two query hooks the union resolves to;
          // widen to `ContentUnit[]` and narrow per branch for the index lookups.
          const data: (ApiPage | ApiSection)[] | undefined = result.data

          return {
            [contentType]:
              contentType === 'page'
                ? selectPageBySlug(data as ApiPage[] | undefined, routeInfo.locale, contentId)
                : selectSectionByPath(data as ApiSection[] | undefined, routeInfo.locale, contentId),
          }
        },
        skip: !courseSlug || !contentId,
      },
    )
  }
}

export default makeUseSelectContentUnit
