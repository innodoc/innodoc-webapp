/* oxlint-disable react/react-compiler -- the probe writes the hook result to a module variable during
render; a test-only capture pattern, the component never renders UI */
import { assert, expect, test } from 'vitest'
import type { ApiSection, TranslatedSection } from '@innodoc/shared-core/types'
import getSectionsApi from '@innodoc/shared-store/slices/content/sections'
import { createTestHarness, TEST_COURSE_SLUG } from '@innodoc/ui-test-utils'
import useSelectSectionChildren from './use-select-section-children.js'

// Section titles are faker-generated and not stable across `@faker-js/faker` releases, so every
// expectation is derived from the raw query data (read through the public RTK Query select()) -
// never hardcoded. The fixture tree: 7 top-level sections, some childless, some nested up to
// several levels deep (see shared-fixtures make-sections.ts).

const seen: { sections: readonly TranslatedSection[] }[] = []

function Probe({ parentId }: { parentId: ApiSection['parentId'] }) {
  seen.push(useSelectSectionChildren(parentId))
  return null
}

/** One hook per parent id, the way StaticToc mounts them. */
function Probes({ order }: { order: ApiSection[] }) {
  return (
    <>
      {order.map((parent) => (
        <Probe key={parent.id} parentId={parent.id} />
      ))}
    </>
  )
}

function rawSections(harness: ReturnType<typeof createTestHarness>): ApiSection[] {
  return (
    getSectionsApi(harness.routeManager).endpoints.getCourseSections.select({ courseSlug: TEST_COURSE_SLUG })(
      harness.store.getState(),
    ).data ?? []
  )
}

test('useSelectSectionChildren returns exactly the direct children of a parent, translated', async () => {
  const harness = createTestHarness()
  await harness.withCourse()
  const raw = rawSections(harness)

  const parent = raw.find((s) => raw.some((c) => c.parentId === s.id))
  assert(parent, 'fixture course should have a section with children')
  const expected = raw.filter((s) => s.parentId === parent.id)
  assert(expected.length > 0, 'the chosen parent should have children')

  harness.render(<Probe parentId={parent.id} />)

  expect(seen.at(-1)?.sections.map((s) => s.id)).toEqual(expected.map((s) => s.id))
  expect(seen.at(-1)?.sections.map((s) => s.title)).toEqual(expected.map((s) => s.title.en))

  // ... and in the route locale
  const de = createTestHarness({
    routeInfo: { courseSlug: TEST_COURSE_SLUG, locale: 'de', name: 'app:course:index' },
  })
  await de.withCourse()
  de.render(<Probe parentId={parent.id} />)

  expect(seen.at(-1)?.sections.map((s) => s.title)).toEqual(expected.map((s) => s.title.de))
})

test('useSelectSectionChildren returns the top-level sections for a null parent id', async () => {
  const harness = createTestHarness()
  await harness.withCourse()
  const raw = rawSections(harness)
  const expected = raw.filter((s) => s.parentId === null)

  harness.render(<Probe parentId={null} />)

  assert(expected.length === 7, 'fixture course should serve seven top-level sections')
  expect(seen.at(-1)?.sections.map((s) => s.id)).toEqual(expected.map((s) => s.id))
})

test('useSelectSectionChildren returns an empty array for a childless section', async () => {
  const harness = createTestHarness()
  await harness.withCourse()
  const raw = rawSections(harness)

  const leaf = raw.find((s) => !raw.some((c) => c.parentId === s.id))
  assert(leaf, 'fixture course should have a childless section')

  harness.render(<Probe parentId={leaf.id} />)

  expect(seen.at(-1)?.sections).toEqual([])
})

test('useSelectSectionChildren returns an empty array outside a course', () => {
  const harness = createTestHarness({ routeInfo: { locale: 'en', name: 'app:index' } })
  harness.render(<Probe parentId={null} />)

  expect(seen.at(-1)?.sections).toEqual([]) // the query is skipped -> the selector's empty-array branch
})

// Regression gate: `createSelector` used to be called inside the hook body, so every render got a
// fresh (un-memoised) selector and a rebuilt array. Do NOT make it green by comparing ids: the
// reference identity is the point.
test('useSelectSectionChildren keeps the children array reference stable across re-renders', async () => {
  const harness = createTestHarness()
  await harness.withCourse()

  const from = seen.length
  const { rerender } = harness.render(<Probe parentId={null} />)
  rerender(<Probe parentId={null} />)

  expect(seen[from + 1]?.sections).toBe(seen[from]?.sections)
})

// StaticToc mounts one hook per rendered section, so the module-level selector is called with many
// different parent ids. A single-entry cache would thrash and rebuild on every call;
// reselect's weakMapMemoize keeps one entry per parent id, which is what this pins.
test('useSelectSectionChildren caches one array per parent id across interleaved consumers', async () => {
  const harness = createTestHarness()
  await harness.withCourse()
  const raw = rawSections(harness)

  const parents = raw.filter((s) => raw.some((c) => c.parentId === s.id)).slice(0, 4)
  assert(parents.length === 4, 'fixture course should have four sections with children')

  const from = seen.length
  const { rerender } = harness.render(<Probes order={parents} />)
  const firstPass = seen.slice(from, from + parents.length)
  // walk the same consumers in reverse: a cache holding fewer than `parents.length` entries has to
  // rebuild, and a rebuilt array is a new reference
  rerender(<Probes order={parents.toReversed()} />)
  const secondPass = seen.slice(from + parents.length, from + 2 * parents.length)

  expect(secondPass).toHaveLength(parents.length)
  for (const [index, entry] of firstPass.entries()) {
    expect(secondPass[parents.length - 1 - index]?.sections).toBe(entry.sections)
  }
})
