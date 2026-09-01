import { isCourseRouteInfo } from '@innodoc/shared-core/typeguards'
import type { ApiSection, SectionWithChildren } from '@innodoc/shared-core/types'
import { selectRouteInfo } from '@innodoc/shared-store/slices/app'
import getSectionsApi from '@innodoc/shared-store/slices/content/sections'
import { selectSectionTree } from '@innodoc/shared-store/slices/content/selectors/sections'
import { useRouteManager } from '@innodoc/ui-shared/hooks'
import { useSelector } from './redux.js'

/**
 * Select section's children and build a nested tree structure.
 *
 * @param parentId parent's ID (acts as the root of the tree)
 * @returns nested array of sections
 */
function useSelectSectionTree(parentId: ApiSection['parentId']): readonly SectionWithChildren[] {
  const routeInfo = useSelector(selectRouteInfo)
  const courseSlug = isCourseRouteInfo(routeInfo) ? routeInfo.courseSlug : undefined
  const routeManager = useRouteManager()
  const sections = getSectionsApi(routeManager)

  // `selectSectionTree` is module-scoped in `@innodoc/shared-store`, so the tree is assembled
  // once per (data, locale, parentId) and its reference is stable across re-renders. Returning
  // an object from `selectFromResult` (and reading `tree` back) also keeps RTK Query from
  // spreading the array into a plain object.
  // oxlint-disable-next-line react/react-compiler -- `sections` is cached via `??=` in `getSectionsApi`, hook ref is stable
  const { tree } = sections.useGetCourseSectionsQuery(
    { courseSlug: courseSlug ?? '' },
    {
      selectFromResult: ({ data }) => ({ tree: selectSectionTree(data, routeInfo.locale, parentId) }),
      skip: !courseSlug,
    },
  )

  return tree
}

export default useSelectSectionTree
