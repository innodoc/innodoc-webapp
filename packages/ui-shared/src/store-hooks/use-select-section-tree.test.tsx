/* oxlint-disable react/react-compiler -- the probe writes the hook result to a module variable during
render; a test-only capture pattern, the component never renders UI */
import { assert, expect, test } from 'vitest'
import type { ApiSection, SectionWithChildren } from '@innodoc/shared-core/types'
import getSectionsApi from '@innodoc/shared-store/slices/content/sections'
import { createTestHarness, TEST_COURSE_SLUG } from '@innodoc/ui-test-utils'
import useSelectSectionTree from './use-select-section-tree.js'

// Expectations are derived from the raw query data (read through the public RTK Query select()),
// never hardcoded: section titles are faker-generated and not stable across `@faker-js/faker`
// releases, and the tree shape (7 top-level sections, nested up to several levels deep) is fixed
// only in structure by shared-fixtures make-sections.ts.

const seen: SectionWithChildren[][] = []

function Probe({ parentId }: { parentId: ApiSection['parentId'] }) {
  seen.push(useSelectSectionTree(parentId))
  return null
}

function flatten(nodes: SectionWithChildren[]): SectionWithChildren[] {
  return nodes.flatMap((n) => [n, ...(n.children ? flatten(n.children) : [])])
}

function rawSections(harness: ReturnType<typeof createTestHarness>): ApiSection[] {
  return (
    getSectionsApi(harness.routeManager).endpoints.getCourseSections.select({ courseSlug: TEST_COURSE_SLUG })(
      harness.store.getState(),
    ).data ?? []
  )
}

/** Ids of all sections whose ancestor chain reaches `rootId` (transitive children). */
function descendantIds(raw: ApiSection[], rootId: ApiSection['id']): Set<number> {
  const ids = new Set(raw.filter((s) => s.parentId === rootId).map((s) => s.id))
  let added = true
  while (added) {
    added = false
    for (const s of raw) {
      if (s.parentId !== null && ids.has(s.parentId) && !ids.has(s.id)) {
        ids.add(s.id)
        added = true
      }
    }
  }
  return ids
}

const sorted = (ids: number[]) => ids.toSorted((a, b) => a - b)

test('useSelectSectionTree returns a real array containing every section exactly once', async () => {
  const harness = createTestHarness()
  await harness.withCourse()
  harness.render(<Probe parentId={null} />)

  const tree = seen.at(-1)
  assert(tree, 'the probe should have rendered')
  expect(Array.isArray(tree)).toBe(true) // pins the array-rebuild workaround: the result must be a plain array

  const raw = rawSections(harness)
  expect(sorted(flatten(tree).map((n) => n.id))).toEqual(sorted(raw.map((s) => s.id)))
  expect(tree.map((n) => n.id)).toEqual(raw.filter((s) => s.parentId === null).map((s) => s.id))
})

test('useSelectSectionTree nests every node under its parent and prunes empty children arrays', async () => {
  const harness = createTestHarness()
  await harness.withCourse()
  const raw = rawSections(harness)
  harness.render(<Probe parentId={null} />)

  const tree = seen.at(-1)
  assert(tree)

  for (const node of flatten(tree)) {
    for (const child of node.children ?? []) {
      expect(child.parentId).toBe(node.id)
    }
    expect(node.children?.length ?? 0).toBe(raw.filter((s) => s.parentId === node.id).length)
  }

  // no node may keep an empty children array (cleanEmptyChildren)
  expect(flatten(tree).filter((n) => n.children?.length === 0)).toHaveLength(0)

  // leaves must carry no `children` property at all - MUI TreeView treats any as expandable
  const leaf = raw.find((s) => !raw.some((c) => c.parentId === s.id))
  assert(leaf, 'fixture course should have a childless section')
  expect(flatten(tree).find((n) => n.id === leaf.id)?.children).toBeUndefined()
})

test('useSelectSectionTree translates nodes in the route locale', async () => {
  const harness = createTestHarness()
  await harness.withCourse()
  const raw = rawSections(harness)
  harness.render(<Probe parentId={null} />)

  const sample = raw.find((s) => s.parentId !== null)
  assert(sample, 'fixture course should have a nested section')
  expect(flatten(seen.at(-1) ?? []).find((n) => n.id === sample.id)?.title).toBe(sample.title.en)

  const de = createTestHarness({
    routeInfo: { courseSlug: TEST_COURSE_SLUG, locale: 'de', name: 'app:course:index' },
  })
  await de.withCourse()
  de.render(<Probe parentId={null} />)

  expect(flatten(seen.at(-1) ?? []).find((n) => n.id === sample.id)?.title).toBe(sample.title.de)
})

test('useSelectSectionTree roots the tree at the requested parent id', async () => {
  const harness = createTestHarness()
  await harness.withCourse()
  const raw = rawSections(harness)

  // a section that has children which themselves have children
  const root = raw.find((s) => raw.some((c) => c.parentId === s.id && raw.some((g) => g.parentId === c.id)))
  assert(root, 'fixture course should have a section nested two levels deep')

  harness.render(<Probe parentId={root.id} />)

  const tree = seen.at(-1)
  assert(tree)
  expect(tree.map((n) => n.id)).toEqual(raw.filter((s) => s.parentId === root.id).map((s) => s.id))
  expect(sorted(flatten(tree).map((n) => n.id))).toEqual(sorted([...descendantIds(raw, root.id)]))
})

test('useSelectSectionTree returns an empty array outside a course', () => {
  const harness = createTestHarness({ routeInfo: { locale: 'en', name: 'app:index' } })
  harness.render(<Probe parentId={null} />)

  expect(seen.at(-1)).toEqual([]) // the query is skipped -> the selector's empty-array branch
})

// Regression gate: the selector is created inside the hook body (no cross-render memoisation) and
// the result is rebuilt with Object.entries() on every render. Marked `fails` on purpose - the
// modifier must be removed when the selector is hoisted and stabilised. Reference identity is the
// point; do not weaken it.
test.fails('useSelectSectionTree keeps the tree reference stable across re-renders', async () => {
  const harness = createTestHarness()
  await harness.withCourse()

  const from = seen.length
  const { rerender } = harness.render(<Probe parentId={null} />)
  rerender(<Probe parentId={null} />)

  expect(seen[from + 1]).toBe(seen[from])
})
