/* oxlint-disable react/react-compiler -- the probe writes the hook results to module variables during
render; a test-only capture pattern, the component never renders UI */
import { assert, expect, test } from 'vitest'
import type { ApiSection, TranslatedPage, TranslatedSection } from '@innodoc/shared-core/types'
import getSectionsApi from '@innodoc/shared-store/slices/content/sections'
import { createTestHarness, TEST_COURSE_SLUG } from '@innodoc/ui-test-utils'
import useSelectPage from './use-select-page.js'
import useSelectSection from './use-select-section.js'

// useSelectPage and useSelectSection are the same hook (makeUseSelectContentUnit) built for the
// two content types, so they are tested together. The `home` page is hardcoded in the fixtures
// (slug and titles); section paths are faker-generated and not stable across @faker-js/faker
// releases, so the expected section is taken from the raw query data rather than hardcoded.

interface ProbeResult {
  page?: TranslatedPage
  section?: TranslatedSection
}

// Captured via push (not reassigned module variables): reassigning during render is a side effect
// that the react-compiler lint rule (error in this repo) rejects.
const seen: ProbeResult[] = []

function Probe({ pageSlug, sectionPath }: { pageSlug?: string; sectionPath?: string }) {
  seen.push({ page: useSelectPage(pageSlug).page, section: useSelectSection(sectionPath).section })
  return null
}

function rawSections(harness: ReturnType<typeof createTestHarness>): ApiSection[] {
  return (
    getSectionsApi(harness.routeManager).endpoints.getCourseSections.select({ courseSlug: TEST_COURSE_SLUG })(
      harness.store.getState(),
    ).data ?? []
  )
}

test('useSelectPage finds the page by slug, translated in the route locale', async () => {
  const en = createTestHarness()
  await en.withCourse()
  en.render(<Probe pageSlug="home" />)

  expect(seen.at(-1)?.page?.slug).toBe('home')
  expect(seen.at(-1)?.page?.title).toBe('Home page')

  const de = createTestHarness({
    routeInfo: { courseSlug: TEST_COURSE_SLUG, locale: 'de', name: 'app:course:index' },
  })
  await de.withCourse()
  de.render(<Probe pageSlug="home" />)

  expect(seen.at(-1)?.page?.title).toBe('Home-Seite')
})

test('useSelectSection finds the section by path, translated', async () => {
  const harness = createTestHarness()
  await harness.withCourse()

  const first = rawSections(harness)[0]
  assert(first, 'fixture course should serve sections')

  harness.render(<Probe sectionPath={first.path} />)

  expect(seen.at(-1)?.section?.id).toBe(first.id)
  expect(seen.at(-1)?.section?.path).toBe(first.path)
  expect(seen.at(-1)?.section?.title).toBe(first.title.en)
})

test('useSelectPage and useSelectSection return undefined for an unknown slug or path', async () => {
  const harness = createTestHarness()
  await harness.withCourse()
  harness.render(<Probe pageSlug="does-not-exist" sectionPath="does/not/exist" />)

  expect(seen.at(-1)?.page).toBeUndefined()
  expect(seen.at(-1)?.section).toBeUndefined()
})

test('useSelectPage and useSelectSection return undefined without an id', () => {
  const harness = createTestHarness() // course route, but no slug/path is asked for
  harness.render(<Probe />)

  expect(seen.at(-1)?.page).toBeUndefined()
  expect(seen.at(-1)?.section).toBeUndefined() // the query is skipped: !contentId
})

test('useSelectPage and useSelectSection return undefined outside a course', () => {
  const harness = createTestHarness({ routeInfo: { locale: 'en', name: 'app:index' } })
  harness.render(<Probe pageSlug="home" sectionPath="foo/bar" />)

  expect(seen.at(-1)?.page).toBeUndefined()
  expect(seen.at(-1)?.section).toBeUndefined() // the query is skipped: !courseSlug
})
