import type { LanguageCode } from 'iso-639-1'
import { createSelector } from '@reduxjs/toolkit'
import { isCourseRouteInfo } from '@innodoc/shared-core/typeguards'
import type { ApiSection, SectionWithChildren } from '@innodoc/shared-core/types'
import { selectRouteInfo } from '@innodoc/shared-store/slices/app'
import getSectionsApi from '@innodoc/shared-store/slices/content/sections'
import { useRouteManager } from '@innodoc/ui-shared/hooks'
import { EMPTY_SECTION_TREE } from './constants.js'
import { useSelector } from './redux.js'
import { translateEntityArray } from './utils.js'

/** Clean up empty children arrays so MUI TreeView knows they are leaf nodes */
function cleanEmptyChildren(nodes: SectionWithChildren[]) {
  for (const node of nodes) {
    if (node.children?.length === 0) {
      delete node.children
    } else if (node.children) {
      cleanEmptyChildren(node.children)
    }
  }
}

/**
 * Module-scope so one cache is shared by every render and every consumer.
 * A `createSelector` call inside the hook body starts with an empty cache on each render, which
 * makes the whole tree rebuild run per render instead of per data change.
 */
const selectSectionTree = createSelector(
  [
    (result: { data: ApiSection[] | undefined }) => result.data,
    (result, _parentId: ApiSection['parentId']) => _parentId,
    (result, _parentId, _locale: LanguageCode) => _locale,
  ],
  (sections, _parentId, _locale): readonly SectionWithChildren[] => {
    if (!sections) {
      return EMPTY_SECTION_TREE
    }

    // Translate the entire flat array first
    const translatedSections = translateEntityArray(sections, _locale)

    // Build a map for efficient O(N) tree construction
    const sectionMap = new Map<number, SectionWithChildren>()
    for (const section of translatedSections) {
      sectionMap.set(section.id, { ...section, children: [] })
    }

    const tree: SectionWithChildren[] = []

    // Assemble the tree
    for (const section of translatedSections) {
      const node = sectionMap.get(section.id)

      if (!node) {
        throw new Error('node is defined here')
      }

      if (section.parentId === _parentId) {
        // If it matches the requested root parentId, add it to the top level of our tree
        tree.push(node)
      } else if (section.parentId !== null) {
        // Otherwise, find its parent and push it to the parent's children array
        const parentNode = sectionMap.get(section.parentId)
        if (parentNode?.children) {
          parentNode.children.push(node)
        }
      }
    }

    // Clean up empty children arrays so MUI TreeView knows they are leaf nodes
    cleanEmptyChildren(tree)

    return tree
  },
)

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

  // `selectFromResult` must return an object, not the tree array itself: RTK Query spreads extra
  // properties (refetch, etc.) onto whatever it returns, which turns an array into
  // {0: ..., 1: ..., refetch: ...} and forces an un-spread on every render.
  // oxlint-disable-next-line react/react-compiler -- `sections` is cached via `??=` in `getSectionsApi`, hook ref is stable
  const result = sections.useGetCourseSectionsQuery(
    { courseSlug: courseSlug ?? '' },
    {
      selectFromResult: (result) => ({ tree: selectSectionTree(result, parentId, routeInfo.locale) }),
      skip: !courseSlug,
    },
  )

  return result.tree
}

export default useSelectSectionTree
