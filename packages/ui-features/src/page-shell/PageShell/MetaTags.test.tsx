import { createHead, UnheadProvider } from '@unhead/react/client'
import { expect, test } from 'vitest'
import { createTestHarness, TEST_COURSE_SLUG, waitFor } from '@innodoc/ui-test-utils'
import MetaTags from './MetaTags.js'

// The client unhead pipeline renders into the real (jsdom) <head>, so these tests read the tags
// the way a browser would. One head instance serves the whole file: unhead only removes a tag on
// a later render of the same head, and the RTL cleanup between tests disposes each test's entries
// so the next test renders into a head that no longer carries them.
const head = createHead()

// Origin of the expected URLs; matches INNODOC_PUBLIC_APP_ROOT in .env.test
const APP_ROOT = 'http://app.example.com'

const alternateLinks = () =>
  [...document.head.querySelectorAll('link[rel="alternate"]')].map((el) => ({
    href: el.getAttribute('href'),
    hreflang: el.getAttribute('hreflang'),
  }))

test('MetaTags canonicalizes the course page URL and offers x-default with the course alternates', async () => {
  const harness = createTestHarness({
    courseSlugMode: 'URL',
    routeInfo: { courseSlug: TEST_COURSE_SLUG, locale: 'de', name: 'app:course:page', pageSlug: 'home' },
  })
  await harness.withCourse()

  harness.render(
    <UnheadProvider value={head}>
      <MetaTags />
    </UnheadProvider>,
  )

  await waitFor(() => {
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      `${APP_ROOT}/de/${TEST_COURSE_SLUG}/page/home`,
    )
  })

  // The fixture course offers en and de, en first: x-default follows the course's first locale,
  // the same destination the app redirects to for a locale the course does not offer.
  expect(alternateLinks()).toEqual([
    { href: `${APP_ROOT}/en/${TEST_COURSE_SLUG}/page/home`, hreflang: 'x-default' },
    { href: `${APP_ROOT}/en/${TEST_COURSE_SLUG}/page/home`, hreflang: 'en' },
    { href: `${APP_ROOT}/de/${TEST_COURSE_SLUG}/page/home`, hreflang: 'de' },
  ])
})

test('MetaTags canonicalizes non-course pages without hreflang alternates', async () => {
  const harness = createTestHarness({
    courseSlugMode: 'URL',
    routeInfo: { locale: 'de', name: 'app:index' },
  })

  harness.render(
    <UnheadProvider value={head}>
      <MetaTags />
    </UnheadProvider>,
  )

  await waitFor(() => {
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(`${APP_ROOT}/de`)
  })

  // No course means no locale alternates - and no x-default either, which would point at a URL
  // the course-locale logic cannot back.
  expect(alternateLinks()).toHaveLength(0)
})
