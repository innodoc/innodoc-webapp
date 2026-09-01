/* oxlint-disable react/react-compiler -- the probe writes the hook result to a module variable during
render; a test-only capture pattern, the component never renders UI */
import { expect, test } from 'vitest'
import { createTestHarness, TEST_COURSE_SLUG } from '@innodoc/ui-test-utils'
import useRoutes from './use-routes.js'

// The expected URL shapes are cross-checked against the RouteManager unit tests in shared-core:
// single-course mode strips the course slug from course routes, URL mode keeps it.

// Captured via push (not a reassigned module variable): reassigning during render is a side
// effect that the react-compiler lint rule (error in this repo) rejects.
const seen: ReturnType<typeof useRoutes>[] = []

function Probe() {
  seen.push(useRoutes())
  return null
}

test('useRoutes.url generates the URL of the current route', () => {
  const en = createTestHarness() // default route: the fixture course index, in English
  en.render(<Probe />)
  expect(seen.at(-1)?.url({})).toBe('/en') // single-course mode: the course index is the locale root

  const de = createTestHarness({
    routeInfo: { courseSlug: TEST_COURSE_SLUG, locale: 'de', name: 'app:course:index' },
  })
  de.render(<Probe />)
  expect(seen.at(-1)?.url({})).toBe('/de')
})

test('useRoutes.url merges the partial route info into the current route', () => {
  const harness = createTestHarness()
  harness.render(<Probe />)

  expect(seen.at(-1)?.url({ name: 'app:course:progress' })).toBe('/en/progress')
  expect(seen.at(-1)?.url({ locale: 'de' })).toBe('/de')
  expect(seen.at(-1)?.url({ name: 'app:course:page', pageSlug: 'home' })).toBe('/en/page/home')
  expect(seen.at(-1)?.url({ name: 'app:course:section', sectionPath: 'intro/subsection' })).toBe(
    '/en/section/intro/subsection',
  )
  expect(seen.at(-1)?.url({ name: 'app:user:login' })).toBe('/en/user/login')
})

test('useRoutes.url puts the course slug into the URL in URL mode', () => {
  const harness = createTestHarness({ courseSlugMode: 'URL' })
  harness.render(<Probe />)

  expect(seen.at(-1)?.url({})).toBe(`/en/${TEST_COURSE_SLUG}`)
  expect(seen.at(-1)?.url({ name: 'app:course:progress' })).toBe(`/en/${TEST_COURSE_SLUG}/progress`)
  expect(seen.at(-1)?.url({ locale: 'de', name: 'app:course:page', pageSlug: 'home' })).toBe(
    `/de/${TEST_COURSE_SLUG}/page/home`,
  )
  // A route outside a course carries no slug
  expect(seen.at(-1)?.url({ name: 'app:index' })).toBe('/en')
})

test('useRoutes.isActiveRoute reports the current route and rejects differing keys', () => {
  const harness = createTestHarness()
  harness.render(<Probe />)
  const isActive = (partial?: Record<string, unknown>) => seen.at(-1)?.isActiveRoute(partial)

  expect(isActive()).toBe(true)
  expect(isActive({})).toBe(true)
  expect(isActive({ name: 'app:course:index' })).toBe(true) // same value as the current route
  expect(isActive({ locale: 'en' })).toBe(true)
  expect(isActive({ pageSlug: 'home' })).toBe(true) // a key the current route lacks does not deactivate
  expect(isActive({ locale: 'de' })).toBe(false)
  expect(isActive({ name: 'app:course:progress' })).toBe(false)
})

test('useRoutes.isActiveRoute matches the current route outside a course', () => {
  const harness = createTestHarness({ routeInfo: { locale: 'en', name: 'app:index' } })
  harness.render(<Probe />)
  const isActive = (partial?: Record<string, unknown>) => seen.at(-1)?.isActiveRoute(partial)

  expect(isActive({ name: 'app:index' })).toBe(true)
  expect(isActive({ name: 'app:course:progress' })).toBe(false)
})

test('useRoutes.parseLinkSpecifier resolves link specifiers', () => {
  const harness = createTestHarness()
  harness.render(<Probe />)

  expect(seen.at(-1)?.parseLinkSpecifier('app:course:page|home')).toStrictEqual({
    name: 'app:course:page',
    pageSlug: 'home',
  })
  expect(seen.at(-1)?.parseLinkSpecifier('app:course:section|intro/a')).toStrictEqual({
    name: 'app:course:section',
    sectionPath: 'intro/a',
  })
  expect(seen.at(-1)?.parseLinkSpecifier('app:index')).toStrictEqual({ name: 'app:index' })
})
