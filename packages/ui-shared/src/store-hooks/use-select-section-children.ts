import { isCourseRouteInfo } from '@innodoc/shared-core/typeguards'
import type { ApiSection, TranslatedSection } from '@innodoc/shared-core/types'
import { selectRouteInfo } from '@innodoc/shared-store/slices/app'
import getSectionsApi from '@innodoc/shared-store/slices/content/sections'
import { selectSectionChildren } from '@innodoc/shared-store/slices/content/selectors/sections'
import { useRouteManager } from '@innodoc/ui-shared/hooks'
import { useSelector } from './redux.js'

/**
 * Select section's children.
 *
 * @param parentId parent's ID
 * @returns array of sections
 */
function useSelectSectionChildren(parentId: ApiSection['parentId']): { sections: readonly TranslatedSection[] } {
  const routeInfo = useSelector(selectRouteInfo)
  const courseSlug = isCourseRouteInfo(routeInfo) ? routeInfo.courseSlug : undefined
  const routeManager = useRouteManager()
  const sections = getSectionsApi(routeManager)

  // `selectSectionChildren` is module-scoped in `@innodoc/shared-store`, so every call - in every
  // component - shares one cache: the children are looked up (not re-filtered and re-translated)
  // in O(1) per parent, and the empty branch returns a frozen module constant.
  // oxlint-disable-next-line react/react-compiler -- `sections` is cached via `??=` in `getSectionsApi`, hook ref is stable
  return sections.useGetCourseSectionsQuery(
    { courseSlug: courseSlug ?? '' },
    {
      selectFromResult: ({ data }) => ({ sections: selectSectionChildren(data, routeInfo.locale, parentId) }),
      skip: !courseSlug,
    },
  )
}

export default useSelectSectionChildren
