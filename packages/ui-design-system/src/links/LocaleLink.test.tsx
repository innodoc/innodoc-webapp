import { expect, test } from 'vitest'
import { createTestHarness, TEST_COURSE_SLUG } from '@innodoc/ui-test-utils'
import LocaleLink from './LocaleLink.js'

test('LocaleLink links the same locale-free route in another locale', () => {
  const harness = createTestHarness({
    courseSlugMode: 'URL',
    routeInfo: { locale: 'en', name: 'app:index' },
  })

  const { getByText } = harness.render(<LocaleLink locale="de">Deutsch</LocaleLink>)

  expect(getByText('Deutsch').getAttribute('href')).toBe('/de')
})

// Not achievable through `AppLink`: for the course index and for page and section routes it hands
// the link to components that rebuild the URL from the store's route info, pinning it to the locale
// that is already in the URL.
test('LocaleLink keeps the course route when switching the locale', async () => {
  const harness = createTestHarness({
    courseSlugMode: 'URL',
    routeInfo: { courseSlug: TEST_COURSE_SLUG, locale: 'en', name: 'app:course:progress' },
  })
  await harness.withCourse()

  const { getByText } = harness.render(<LocaleLink locale="de">Deutsch</LocaleLink>)

  expect(getByText('Deutsch').getAttribute('href')).toBe(`/de/${TEST_COURSE_SLUG}/progress`)
})
