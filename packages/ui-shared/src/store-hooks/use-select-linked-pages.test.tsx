/* oxlint-disable react/react-compiler -- the probe writes the hook result to a module variable during
render; a test-only capture pattern, the component never renders UI */
import { assert, expect, test } from 'vitest'
import type { ApiPage, PageLinkLocation, TranslatedPage } from '@innodoc/shared-core/types'
import getPagesApi from '@innodoc/shared-store/slices/content/pages'
import { createTestHarness, TEST_COURSE_SLUG } from '@innodoc/ui-test-utils'
import useSelectLinkedPages from './use-select-linked-pages.js'

// The fixture course serves six pages: `home` (linked to nav and footer, with hardcoded titles),
// a second page linked to nav and footer (faker titles), and four pages linked to the footer only.
// Which pages belong to a slot is therefore asserted against the raw query data - only the `home`
// page's title is hardcoded - so the test does not depend on the faker word lists.

// Captured via push (not a reassigned module variable): reassigning during render is a side
// effect that the react-compiler lint rule (error in this repo) rejects.
const seen: { pages: TranslatedPage[] }[] = []

function Probe({ linkLocation }: { linkLocation: PageLinkLocation }) {
  seen.push(useSelectLinkedPages(linkLocation))
  return null
}

function rawPages(harness: ReturnType<typeof createTestHarness>): ApiPage[] {
  return (
    getPagesApi(harness.routeManager).endpoints.getCoursePages.select({ courseSlug: TEST_COURSE_SLUG })(
      harness.store.getState(),
    ).data ?? []
  )
}

test('useSelectLinkedPages returns exactly the pages linked to the nav slot, translated', async () => {
  const harness = createTestHarness()
  await harness.withCourse()
  harness.render(<Probe linkLocation="nav" />)

  const expected = rawPages(harness).filter((p) => (p.linked ?? []).includes('nav'))
  assert(expected.length === 2, 'fixture course should link exactly two pages to the nav')

  expect(seen.at(-1)?.pages.map((p) => p.id)).toEqual(expected.map((p) => p.id))
  expect(seen.at(-1)?.pages.map((p) => p.title)).toEqual(expected.map((p) => p.title.en))
})

test('useSelectLinkedPages translates page titles in the route locale', async () => {
  const harness = createTestHarness({
    routeInfo: { courseSlug: TEST_COURSE_SLUG, locale: 'de', name: 'app:course:index' },
  })
  await harness.withCourse()
  harness.render(<Probe linkLocation="nav" />)

  expect(seen.at(-1)?.pages.find((p) => p.slug === 'home')?.title).toBe('Home-Seite')
})

test('useSelectLinkedPages returns every page for the footer slot', async () => {
  const harness = createTestHarness()
  await harness.withCourse()
  harness.render(<Probe linkLocation="footer" />)

  expect(seen.at(-1)?.pages).toHaveLength(6)
  expect(seen.at(-1)?.pages.map((p) => p.id)).toEqual(rawPages(harness).map((p) => p.id))
})

test('useSelectLinkedPages returns an empty array outside a course', () => {
  const harness = createTestHarness({ routeInfo: { locale: 'en', name: 'app:index' } })
  harness.render(<Probe linkLocation="nav" />)

  expect(seen.at(-1)?.pages).toEqual([]) // the query is skipped -> the selector's empty-array branch
})
