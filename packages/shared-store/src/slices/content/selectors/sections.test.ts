import { assert, expect, test } from 'vitest'
import { EMPTY_SECTION_TREE, EMPTY_TRANSLATED_SECTIONS } from '@innodoc/shared-core/sentinels'
import type { ApiSection } from '@innodoc/shared-core/types'
import {
  selectBreadcrumbSections,
  selectSectionByPath,
  selectSectionChildren,
  selectSectionIndex,
  selectSectionTree,
} from '#slices/content/selectors/sections'

const createdAt = new Date('2024-01-01T00:00:00.000Z')
const updatedAt = new Date('2024-01-02T00:00:00.000Z')

function makeSection(id: number, path: string, parentId: number | null): ApiSection {
  return {
    createdAt,
    courseId: 1,
    id,
    order: [id],
    parentId,
    path,
    shortTitle: null,
    title: { de: `Titel ${String(id)}`, en: `Title ${String(id)}` },
    type: 'regular',
    updatedAt,
  }
}

// a -+
//    b -+
//       c
// d
const data: ApiSection[] = [
  makeSection(1, 'a', null),
  makeSection(2, 'a/b', 1),
  makeSection(3, 'a/b/c', 2),
  makeSection(4, 'd', null),
]

test('selectSectionIndex translates each section once per (data, locale), no matter how many views ask', () => {
  selectSectionIndex.resetRecomputations()

  // Several consumers, several keys, one (data, locale)
  selectSectionChildren(data, 'en', null)
  selectSectionChildren(data, 'en', 1)
  selectSectionByPath(data, 'en', 'a/b')
  selectBreadcrumbSections(data, 'en', 'a/b/c')
  selectSectionTree(data, 'en', null)

  expect(selectSectionIndex.recomputations()).toBe(1)

  // A different locale is a different (data, locale) - one more, then a hit
  selectSectionChildren(data, 'de', null)
  expect(selectSectionIndex.recomputations()).toBe(2)
  selectSectionChildren(data, 'de', null)
  expect(selectSectionIndex.recomputations()).toBe(2)

  // A fresh data array (a refetch) is a different (data, locale) - one more
  const fresh = data.map((section) => ({ ...section }))
  selectSectionChildren(fresh, 'en', null)
  expect(selectSectionIndex.recomputations()).toBe(3)
})

test('the flat views share one translated object per section', () => {
  const children = selectSectionChildren(data, 'en', 1)
  expect(children).toHaveLength(1)

  // byPath, childrenOf and the breadcrumb all hand out the same object
  expect(children[0]).toBe(selectSectionByPath(data, 'en', 'a/b'))
  const breadcrumb = selectBreadcrumbSections(data, 'en', 'a/b/c')
  expect(breadcrumb[1]).toBe(selectSectionByPath(data, 'en', 'a/b'))
})

test('selectSectionChildren returns the direct children of a parent, in API order, translated', () => {
  expect(selectSectionChildren(data, 'en', null).map((s) => s.path)).toEqual(['a', 'd'])
  expect(selectSectionChildren(data, 'en', 1)).toHaveLength(1)
  expect(selectSectionChildren(data, 'en', 1)[0]?.title).toBe('Title 2')
  expect(selectSectionChildren(data, 'de', 1)[0]?.title).toBe('Titel 2')
})

test('selectSectionChildren returns the frozen empty sentinel for a parent without children', () => {
  // a leaf
  expect(selectSectionChildren(data, 'en', 3)).toBe(EMPTY_TRANSLATED_SECTIONS)
  // an id that is not in the data at all
  expect(selectSectionChildren(data, 'en', 999)).toBe(EMPTY_TRANSLATED_SECTIONS)
  // no data yet
  expect(selectSectionChildren(undefined, 'en', null)).toBe(EMPTY_TRANSLATED_SECTIONS)
})

test('selectSectionByPath finds a section, undefined for an unknown or missing path', () => {
  expect(selectSectionByPath(data, 'en', 'a/b/c')?.id).toBe(3)
  expect(selectSectionByPath(data, 'en', 'nope')).toBeUndefined()
  expect(selectSectionByPath(data, 'en')).toBeUndefined() // no path given
  expect(selectSectionByPath(undefined, 'en', 'a')).toBeUndefined()
})

test('selectBreadcrumbSections returns the section plus every ancestor, root first', () => {
  const breadcrumb = selectBreadcrumbSections(data, 'en', 'a/b/c')

  expect(breadcrumb.map((s) => s.path)).toEqual(['a', 'a/b', 'a/b/c'])

  // the chain is reference-stable across calls with the same (data, locale, path)
  expect(selectBreadcrumbSections(data, 'en', 'a/b/c')).toBe(breadcrumb)
})

test('selectBreadcrumbSections returns the frozen empty sentinel for a missing path or without data', () => {
  expect(selectBreadcrumbSections(data, 'en', 'nope/section')).toBe(EMPTY_TRANSLATED_SECTIONS)
  expect(selectBreadcrumbSections(data, 'en')).toBe(EMPTY_TRANSLATED_SECTIONS) // no path given
  expect(selectBreadcrumbSections(undefined, 'en', 'a/b/c')).toBe(EMPTY_TRANSLATED_SECTIONS)
})

test('selectSectionTree nests every node under its parent and prunes empty children arrays', () => {
  const tree = selectSectionTree(data, 'en', null)

  expect(tree.map((n) => n.path)).toEqual(['a', 'd'])
  expect(tree[0]?.children?.map((n) => n.path)).toEqual(['a/b'])
  expect(tree[0]?.children?.[0]?.children?.map((n) => n.path)).toEqual(['a/b/c'])

  // leaves carry no `children` property at all - MUI TreeView treats any as expandable
  const leaf = selectSectionTree(data, 'en', 2)
  expect(leaf).toHaveLength(1)
  expect(leaf[0]?.path).toBe('a/b/c')
  expect(leaf[0]?.children).toBeUndefined()
})

test('selectSectionTree roots the tree at the requested parent id', () => {
  const tree = selectSectionTree(data, 'en', 2)

  expect(tree.map((n) => n.path)).toEqual(['a/b/c'])
})

test('selectSectionTree returns the frozen empty sentinel without data', () => {
  expect(selectSectionTree(undefined, 'en', null)).toBe(EMPTY_SECTION_TREE)
  expect(selectSectionTree([], 'en', null)).toBe(EMPTY_SECTION_TREE)
})

test('selectSectionTree keeps its tree reference stable across calls', () => {
  expect(selectSectionTree(data, 'en', null)).toBe(selectSectionTree(data, 'en', null))
})

test('tree nodes are copies: the tree mutation never reaches the flat views', () => {
  // The tree pushes into `children` and deletes it on leaves (cleanEmptyChildren). Those
  // mutations must not reach the index's objects, which the flat views hand out (the index holds
  // pure translated entities, the tree keeps its own node copies).
  const flatA = selectSectionByPath(data, 'en', 'a')
  assert(flatA, 'the fixture should contain the section')

  selectSectionTree(data, 'en', null)

  // 'a' is an internal node: its tree node gained a `children` array, the flat object must not
  expect('children' in flatA).toBe(false)
  // and the index keeps handing out the same object
  expect(selectSectionByPath(data, 'en', 'a')).toBe(flatA)
})
