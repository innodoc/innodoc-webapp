import type { LanguageCode } from 'iso-639-1'
import { createSelector } from '@reduxjs/toolkit'
import { isCourseRouteInfo } from '@innodoc/shared-core/typeguards'
import type { ApiSection, TranslatedSection } from '@innodoc/shared-core/types'
import { selectRouteInfo } from '@innodoc/shared-store/slices/app'
import getSectionsApi from '@innodoc/shared-store/slices/content/sections'
import { useRouteManager } from '@innodoc/ui-shared/hooks'
import { useSelector } from './redux.js'
import { translateEntityArray } from './utils.js'

/** TranslatedSection with recursive children */
type NestedTranslatedSection = TranslatedSection & {
  children?: NestedTranslatedSection[]
}

/** Clean up empty children arrays so MUI TreeView knows they are leaf nodes */
function cleanEmptyChildren(nodes: NestedTranslatedSection[]) {
  for (const node of nodes) {
    if (node.children?.length === 0) {
      delete node.children
    } else if (node.children) {
      cleanEmptyChildren(node.children)
    }
  }
}

/**
 * Select section's children and build a nested tree structure.
 *
 * @param parentId parent's ID (acts as the root of the tree)
 * @returns nested array of sections
 */
function useSelectSectionTree(parentId: ApiSection['parentId']): NestedTranslatedSection[] {
  const routeInfo = useSelector(selectRouteInfo)
  const courseSlug = isCourseRouteInfo(routeInfo) ? routeInfo.courseSlug : undefined
  const routeManager = useRouteManager()
  const sections = getSectionsApi(routeManager)

  const emptyArray: NestedTranslatedSection[] = []

  const selectSectionTree = createSelector(
    [
      (result: { data: ApiSection[] | undefined }) => result.data,
      (result, _parentId: ApiSection['parentId']) => _parentId,
      (result, _parentId, _locale: LanguageCode) => _locale,
    ],
    (sections, _parentId, _locale) => {
      if (!sections) {
        return emptyArray
      }

      // Translate the entire flat array first
      const translatedSections = translateEntityArray(sections, _locale)

      // Build a map for efficient O(N) tree construction
      const sectionMap = new Map<number, NestedTranslatedSection>()
      for (const section of translatedSections) {
        sectionMap.set(section.id, { ...section, children: [] })
      }

      const tree: NestedTranslatedSection[] = []

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

  // oxlint-disable-next-line react/react-compiler -- `sections` is cached via `??=` in `getSectionsApi`, hook ref is stable
  const result = sections.useGetCourseSectionsQuery(
    { courseSlug: courseSlug ?? '' },
    {
      selectFromResult: (result) => selectSectionTree(result, parentId, routeInfo.locale),
      skip: !courseSlug,
    },
  )

  // RTK Query spreads extra properties (refetch, etc.) onto selectFromResult's return value.
  // When it returns an array, the result becomes {0: ..., 1: ..., refetch: ...} - not a real array.
  // Filter to only numeric keys to get back a proper array.
  return Object.entries(result)
    .filter(([key]) => Number.isInteger(Number(key)))
    .toSorted(([a], [b]) => Number(a) - Number(b))
    .map(([, value]) => value)
}

export default useSelectSectionTree
