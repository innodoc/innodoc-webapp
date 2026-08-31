/* oxlint-disable react/react-compiler -- the probe writes the hook result to a module variable during
render; a test-only capture pattern, the component never renders UI */
import { expect, test } from 'vitest'
import type { TranslatedCourse } from '@innodoc/shared-core/types'
import { createTestHarness, TEST_COURSE_SLUG } from '@innodoc/ui-test-utils'
import useSelectCurrentCourse from './use-select-current-course.js'

// Unlike the section titles (faker-generated, and not stable across `@faker-js/faker` releases -
// see the note in StaticToc.test), the fixture course's titles are hardcoded in
// @innodoc/shared-fixtures, so the translation can be asserted as an exact string.

// Captured via push (not a reassigned module variable): reassigning during render is a side
// effect that the react-compiler lint rule (error in this repo) rejects.
const seen: { course?: TranslatedCourse }[] = []

function Probe() {
  seen.push(useSelectCurrentCourse())
  return null
}

test('useSelectCurrentCourse returns the course translated in the route locale', async () => {
  const en = createTestHarness() // default route: the fixture course index, in English
  await en.withCourse()
  en.render(<Probe />)

  expect(seen.at(-1)?.course?.slug).toBe(TEST_COURSE_SLUG)
  expect(seen.at(-1)?.course?.title).toBe('Course for testing')

  const de = createTestHarness({
    routeInfo: { courseSlug: TEST_COURSE_SLUG, locale: 'de', name: 'app:course:index' },
  })
  await de.withCourse()
  de.render(<Probe />)

  expect(seen.at(-1)?.course?.title).toBe('Kurs zum Testen')
})

test('useSelectCurrentCourse returns no course outside a course', () => {
  const harness = createTestHarness({ routeInfo: { locale: 'en', name: 'app:index' } })
  harness.render(<Probe />)

  expect(seen.at(-1)?.course).toBeUndefined() // the query is skipped: the route carries no courseSlug
})
