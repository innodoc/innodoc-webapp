/* oxlint-disable react/react-compiler -- the probe writes the hook result to a module variable during
render; a test-only capture pattern, the component never renders UI */
import { assert, expect, test } from 'vitest'
import type { ApiSection, TranslatedSection } from '@innodoc/shared-core/types'
import getSectionsApi from '@innodoc/shared-store/slices/content/sections'
import { createTestHarness, TEST_COURSE_SLUG } from '@innodoc/ui-test-utils'
import { EMPTY_TRANSLATED_SECTIONS } from './constants.js'
import useSelectBreadcrumbSections from './use-select-breadcrumb-sections.js'

// The hook is route-driven: on `app:course:section` it derives the breadcrumb chain from the
// section path prefixes. Fixtures guarantee every ancestor path exists (make-sections.ts builds
// `path` as parentPath + segment), so the expected chain is recomputed from the raw query data -
// titles are faker-generated and never hardcoded.

const seen: { sections: readonly TranslatedSection[] }[] = []

function Probe() {
  seen.push(useSelectBreadcrumbSections())
  return null
}

function rawSections(harness: ReturnType<typeof createTestHarness>): ApiSection[] {
  return (
    getSectionsApi(harness.routeManager).endpoints.getCourseSections.select({ courseSlug: TEST_COURSE_SLUG })(
      harness.store.getState(),
    ).data ?? []
  )
}

function sectionRoute(locale: 'en' | 'de', sectionPath: string) {
  return { courseSlug: TEST_COURSE_SLUG, locale, name: 'app:course:section', sectionPath } as const
}

/** Ancestors of `path` plus the section itself, root first - the expected breadcrumb chain. */
function ancestorChain(raw: ApiSection[], path: string): ApiSection[] {
  const parts = path.split('/')
  const chain = parts
    .map((_, idx) => raw.find((s) => s.path === parts.slice(0, idx + 1).join('/')))
    .filter((s): s is ApiSection => s !== undefined)
  assert(chain.length === parts.length, 'fixture should serve every path prefix as a section')
  return chain
}

test('useSelectBreadcrumbSections returns the ancestor chain of the current section, translated', async () => {
  const harness = createTestHarness()
  await harness.withCourse()
  const raw = rawSections(harness)

  const deep = raw.find((s) => s.path.split('/').length >= 3)
  assert(deep, 'fixture course should have a section nested two levels deep')
  const expected = ancestorChain(raw, deep.path)

  harness.setRoute(sectionRoute('en', deep.path))
  harness.render(<Probe />)

  const chain = seen.at(-1)?.sections
  assert(chain, 'the probe should have rendered')
  expect(chain.map((s) => s.id)).toEqual(expected.map((s) => s.id)) // root first, current section last
  expect(chain.at(-1)?.id).toBe(deep.id)
  expect(chain.map((s) => s.title)).toEqual(expected.map((s) => s.title.en))

  // the chain is root first, extends by exactly one path segment per step, and ends at the
  // current section - expected is built from the path prefixes themselves
  expect(chain.map((s) => s.path)).toEqual(expected.map((s) => s.path))

  // ... and the chain follows the route locale
  const de = createTestHarness()
  await de.withCourse()
  de.setRoute(sectionRoute('de', deep.path))
  de.render(<Probe />)

  expect(seen.at(-1)?.sections.map((s) => s.title)).toEqual(expected.map((s) => s.title.de))
})

test('useSelectBreadcrumbSections returns a single breadcrumb for a top-level section', async () => {
  const harness = createTestHarness()
  await harness.withCourse()
  const raw = rawSections(harness)

  const top = raw.find((s) => s.parentId === null)
  assert(top, 'fixture course should have top-level sections')

  harness.setRoute(sectionRoute('en', top.path))
  harness.render(<Probe />)

  expect(seen.at(-1)?.sections.map((s) => s.id)).toEqual([top.id])
  expect(seen.at(-1)?.sections[0]?.title).toBe(top.title.en)
})

test('useSelectBreadcrumbSections returns an empty array on a non-section route', async () => {
  const harness = createTestHarness() // default: the course index route, no sectionPath
  await harness.withCourse() // data is present - the emptiness comes from the skipped query
  harness.render(<Probe />)

  expect(seen.at(-1)?.sections).toEqual([])
})

test('useSelectBreadcrumbSections returns an empty array for an unknown section path', async () => {
  const harness = createTestHarness()
  await harness.withCourse()
  harness.setRoute(sectionRoute('en', 'no/such/path'))
  harness.render(<Probe />)

  expect(seen.at(-1)?.sections).toEqual([]) // the section lookup fails -> the selector's empty-array branch
})

test('useSelectBreadcrumbSections keeps the breadcrumb array reference stable across re-renders', async () => {
  const harness = createTestHarness()
  await harness.withCourse()
  const raw = rawSections(harness)
  const deep = raw.find((s) => s.path.split('/').length >= 3)
  assert(deep, 'fixture course should have a section nested two levels deep')
  harness.setRoute(sectionRoute('en', deep.path))

  const from = seen.length
  const { rerender } = harness.render(<Probe />)
  rerender(<Probe />)

  // Regression gate: the selector used to be created inside the hook body,
  // so every render rebuilt the chain. Reference identity is the point; do not weaken it.
  expect(seen[from + 1]?.sections).toBe(seen[from]?.sections)
})

test('useSelectBreadcrumbSections returns the same empty sentinel while the query is skipped', () => {
  const harness = createTestHarness() // default: the course index route, no sectionPath -> skipped query

  const from = seen.length
  const { rerender } = harness.render(<Probe />)
  rerender(<Probe />)

  // A fresh `[]` per render defeats RTK Query's shallowEqual gate, so the consumer re-renders with
  // the store. The frozen sentinel from `./constants.js` is the stable answer.
  expect(seen[from + 1]?.sections).toBe(EMPTY_TRANSLATED_SECTIONS)
  expect(seen[from + 1]?.sections).toBe(seen[from]?.sections)
})
