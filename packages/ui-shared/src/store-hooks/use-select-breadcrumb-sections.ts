import { isCourseSectionRouteInfo } from '@innodoc/shared-core/typeguards'
import type { TranslatedSection } from '@innodoc/shared-core/types'
import { selectRouteInfo } from '@innodoc/shared-store/slices/app'
import getSectionsApi from '@innodoc/shared-store/slices/content/sections'
import { selectBreadcrumbSections } from '@innodoc/shared-store/slices/content/selectors/sections'
import { useRouteManager } from '@innodoc/ui-shared/hooks'
import { useSelector } from './redux.js'

/**
 * Create section data for the Breadcrumb component. E.g.:
 * ```
 * [
 *  { path: 'foo', ... },
 *  { path: 'foo/bar', ... },
 *  { path: 'foo/bar/baz', ... },
 * ]
 * ```
 *
 * @returns Array of sections
 */
function useSelectBreadcrumbSections(): { sections: readonly TranslatedSection[] } {
  const routeInfo = useSelector(selectRouteInfo)
  const { courseSlug, sectionPath } = isCourseSectionRouteInfo(routeInfo)
    ? routeInfo
    : { courseSlug: undefined, sectionPath: undefined }
  const routeManager = useRouteManager()
  const sections = getSectionsApi(routeManager)

  // `selectBreadcrumbSections` is module-scoped in `@innodoc/shared-store`: the chain is looked
  // up in the shared index, not `find`ed per path part, and its reference is stable across
  // re-renders.
  // oxlint-disable-next-line react/react-compiler -- `sections` is cached via `??=` in `getSectionsApi`, hook ref is stable
  return sections.useGetCourseSectionsQuery(
    { courseSlug: courseSlug ?? '' },
    {
      selectFromResult: ({ data }) => ({ sections: selectBreadcrumbSections(data, routeInfo.locale, sectionPath) }),
      skip: !courseSlug || !sectionPath,
    },
  )
}

export default useSelectBreadcrumbSections
