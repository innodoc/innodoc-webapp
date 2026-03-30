import { createSelector } from '@reduxjs/toolkit'
import { use, useMemo } from 'react'
import type { LanguageCode } from 'iso-639-1'

import { isCourseRouteInfo } from '@innodoc/shared-core/typeguards'
import { RouteManagerContext } from '@innodoc/ui-shared/contexts'
import type { ApiSection, TranslatedSection } from '@innodoc/shared-core/types'

import { selectRouteInfo } from '#slices/app'
import getSectionsApi from '#slices/content/sections'

import { useSelector } from './redux.js'
import { translateEntityArray } from './utils.js'

/** TranslatedSection with recursive children */
type NestedTranslatedSection = TranslatedSection & {
  children?: NestedTranslatedSection[]
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
  const routeManager = use(RouteManagerContext)
  const sections = getSectionsApi(routeManager)

  const selectSectionTree = useMemo(() => {
    const emptyArray: NestedTranslatedSection[] = []

    return createSelector(
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
            if (parentNode && parentNode.children) {
              parentNode.children.push(node)
            }
          }
        }

        // Clean up empty children arrays so MUI TreeView knows they are leaf nodes
        const cleanEmptyChildren = (nodes: NestedTranslatedSection[]) => {
          for (const node of nodes) {
            if (node.children?.length === 0) {
              delete node.children
            } else if (node.children) {
              cleanEmptyChildren(node.children)
            }
          }
        }

        cleanEmptyChildren(tree)

        return tree
      },
    )
  }, [])

  const result = sections.useGetCourseSectionsQuery(
    { courseSlug: courseSlug ?? '' },
    {
      selectFromResult: (result) => selectSectionTree(result, parentId, routeInfo.locale),
      skip: !courseSlug,
    },
  )

  return Array.isArray(result) ? result : []
}

export default useSelectSectionTree
