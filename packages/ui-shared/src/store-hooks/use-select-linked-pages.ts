import { isCourseRouteInfo } from '@innodoc/shared-core/typeguards'
import type { PageLinkLocation, TranslatedPage } from '@innodoc/shared-core/types'
import { selectRouteInfo } from '@innodoc/shared-store/slices/app'
import getPagesApi from '@innodoc/shared-store/slices/content/pages'
import { selectLinkedPages } from '@innodoc/shared-store/slices/content/selectors/pages'
import { useRouteManager } from '@innodoc/ui-shared/hooks'
import { useSelector } from './redux.js'

/**
 * Select pages for link lists.
 *
 * @param linkLocation page location for links
 * @returns array of pages
 */
function useSelectLinkedPages(linkLocation: PageLinkLocation): { pages: readonly TranslatedPage[] } {
  const routeInfo = useSelector(selectRouteInfo)
  const courseSlug = isCourseRouteInfo(routeInfo) ? routeInfo.courseSlug : undefined
  const routeManager = useRouteManager()
  const pages = getPagesApi(routeManager)

  // `selectLinkedPages` is module-scoped in `@innodoc/shared-store`, so every nav slot shares
  // one page translation and the slot list is looked up (not re-filtered and re-translated).
  // oxlint-disable-next-line react/react-compiler -- `pages` is cached via `??=` in `getPagesApi`, hook ref is stable
  return pages.useGetCoursePagesQuery(
    { courseSlug: courseSlug ?? '' },
    {
      selectFromResult: ({ data }) => ({ pages: selectLinkedPages(data, routeInfo.locale, linkLocation) }),
      skip: !courseSlug,
    },
  )
}

export default useSelectLinkedPages
