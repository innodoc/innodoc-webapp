import { createSelector } from '@reduxjs/toolkit'
import { translateEntity } from '@innodoc/shared-core/translate'
import type { ApiSection, LanguageCode, SectionWithChildren, TranslatedSection } from '@innodoc/shared-core/types'

/**
 * Frozen sentinels for the "no data yet / not applicable" branches. A fresh `[]` returned from a
 * `selectFromResult` defeats RTK Query's `shallowEqual` gate, so every skipped/loading consumer
 * re-renders with the store. Frozen: a write throws in strict mode
 * instead of silently corrupting every consumer at once.
 */
const EMPTY_TRANSLATED_SECTIONS: readonly TranslatedSection[] = Object.freeze([])
const EMPTY_SECTION_TREE: readonly SectionWithChildren[] = Object.freeze([])

/**
 * One translated copy of every section, plus the two indexes every consumer needs.
 *
 * `localized` / `childrenOf` preserve the API's order; there is deliberately no sorting anywhere.
 * The rendered TOC has always followed API order (the ordering `order: number[]` is the data's to
 * apply), and if a view ever needs a different order, sort **once in this index** - never per
 * view, which would rebuild the order on every consumer.
 */
interface SectionIndex {
  /** Every section, translated, in API order */
  readonly localized: TranslatedSection[]
  /** section.path → section */
  readonly byPath: Map<string, TranslatedSection>
  /** parent id (`null` = top level) → direct children, in API order */
  readonly childrenOf: Map<ApiSection['parentId'], TranslatedSection[]>
}

/**
 * Module scope, on purpose: one instance for the whole app. Reselect 5's default
 * `weakMapMemoize` keys the cache trie by the RTK Query `data` array (per store, collected with
 * it, so SSR requests never share stale entries) and by the primitive `locale`, so the index -
 * and the translation that builds it - runs exactly once per (data, locale) no matter how many
 * hooks or components ask for it.
 *
 * Exposed (not only internal) so the referential-stability tests can assert on `recomputations()`
 * and on the shared identity of the translated objects.
 */
const selectSectionIndex = createSelector(
  [(data: ApiSection[] | undefined) => data, (_data: ApiSection[] | undefined, locale: LanguageCode) => locale],
  (sections, locale): SectionIndex => {
    const localized = (sections ?? []).map((section) => translateEntity(section, locale))
    const byPath = new Map<string, TranslatedSection>()
    const childrenOf = new Map<ApiSection['parentId'], TranslatedSection[]>()
    for (const section of localized) {
      byPath.set(section.path, section)
      const bucket = childrenOf.get(section.parentId)
      if (bucket) {
        bucket.push(section)
      } else {
        childrenOf.set(section.parentId, [section])
      }
    }
    return { localized, byPath, childrenOf }
  },
)

/**
 * Select a section by its path.
 *
 * Plain function, not memoised: it returns a reference the index already holds, so there is
 * nothing to recompute and no reference to stabilise.
 */
function selectSectionByPath(
  data: ApiSection[] | undefined,
  locale: LanguageCode,
  path?: string,
): TranslatedSection | undefined {
  if (path === undefined) {
    return undefined
  }
  return selectSectionIndex(data, locale).byPath.get(path)
}

/**
 * Select the direct children of a parent section (`null` = the top-level sections).
 *
 * O(1) in the number of children via the `childrenOf` index instead of filtering the whole array
 * per parent. Plain function for the same reason as
 * {@link selectSectionByPath}.
 */
function selectSectionChildren(
  data: ApiSection[] | undefined,
  locale: LanguageCode,
  parentId: ApiSection['parentId'],
): readonly TranslatedSection[] {
  return selectSectionIndex(data, locale).childrenOf.get(parentId) ?? EMPTY_TRANSLATED_SECTIONS
}

/**
 * Select the breadcrumb chain of a section path: the section itself plus every ancestor, from
 * the root down. Ancestors are looked up in the `byPath` index instead of `find`ing the whole
 * array per path part.
 *
 * Returns the frozen empty sentinel when the path is absent from the data (as before), so the
 * "loading / outside a course" branch is reference-stable.
 */
const selectBreadcrumbSections = createSelector(
  [selectSectionIndex, (_data: ApiSection[] | undefined, _locale: LanguageCode, sectionPath?: string) => sectionPath],
  (index, sectionPath): readonly TranslatedSection[] => {
    if (sectionPath === undefined || index.byPath.get(sectionPath) === undefined) {
      return EMPTY_TRANSLATED_SECTIONS
    }

    const parts = sectionPath.split('/')
    const sections: TranslatedSection[] = []
    for (let idx = 0; idx < parts.length; ++idx) {
      const section = index.byPath.get(parts.slice(0, idx + 1).join('/'))
      if (section) {
        sections.push(section)
      }
    }
    return sections
  },
)

/** Clean up empty children arrays so MUI TreeView knows they are leaf nodes */
function cleanEmptyChildren(nodes: SectionWithChildren[]): void {
  for (const node of nodes) {
    if (node.children?.length === 0) {
      delete node.children
    } else if (node.children) {
      cleanEmptyChildren(node.children)
    }
  }
}

/**
 * Select the section tree rooted at `rootParentId`.
 *
 * Assembly only - this selector never translates: the nodes are copies of the index's translated
 * sections, because the assembly mutates them (`children.push`, and `cleanEmptyChildren` deletes
 * `node.children` on leaves) and the flat views (`selectSectionChildren`, `selectSectionByPath`,
 * the breadcrumb) must not see that mutation. The copies therefore are not `===` to the flat
 * views (deliberate copies, not aliases), but they are stable across renders for
 * unchanged (data, locale, rootParentId) - which is what makes `React.memo` on tree items work.
 */
const selectSectionTree = createSelector(
  [
    selectSectionIndex,
    (_data: ApiSection[] | undefined, _locale: LanguageCode, rootParentId: ApiSection['parentId']) => rootParentId,
  ],
  (index, rootParentId): readonly SectionWithChildren[] => {
    if (index.localized.length === 0) {
      return EMPTY_SECTION_TREE
    }

    // Build a map for efficient O(N) tree construction
    const nodes = new Map<number, SectionWithChildren>()
    for (const section of index.localized) {
      nodes.set(section.id, { ...section, children: [] })
    }

    const tree: SectionWithChildren[] = []
    for (const node of nodes.values()) {
      if (node.parentId === rootParentId) {
        // If it matches the requested root parentId, add it to the top level of our tree
        tree.push(node)
      } else if (node.parentId !== null) {
        // Otherwise, find its parent and push it into the parent's children array
        const parentNode = nodes.get(node.parentId)
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

export {
  EMPTY_SECTION_TREE,
  EMPTY_TRANSLATED_SECTIONS,
  selectBreadcrumbSections,
  selectSectionByPath,
  selectSectionChildren,
  selectSectionIndex,
  selectSectionTree,
}
