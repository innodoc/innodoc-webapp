/* oxlint-disable react/react-compiler -- the probe writes the hook result to a module variable during
render; a test-only capture pattern, the component never renders UI */
import { memo } from 'react'
import { expect, test } from 'vitest'
import { changeIsProcessing } from '@innodoc/shared-store/slices/hast'
import { act, createTestHarness, TEST_COURSE_SLUG } from '@innodoc/ui-test-utils'
import { useSelector } from './redux.js'
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

// The probe for the memo-bailout test: subscribes to the hast slice so an unrelated dispatch
// re-renders it, while `url` comes from `useRoutes()`
const urlRenders: ReturnType<typeof useRoutes>['url'][] = []

function UrlProbe({ url }: { url: ReturnType<typeof useRoutes>['url'] }) {
  urlRenders.push(url)
  return null
}

const MemoizedUrlProbe = memo(UrlProbe)

function MemoChildProbe() {
  useSelector((state) => state.hast.isProcessing)
  const { url } = useRoutes()
  return <MemoizedUrlProbe url={url} />
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

test('useRoutes returns the same object and url function across re-renders without navigation', () => {
  const harness = createTestHarness()
  const stable: ReturnType<typeof useRoutes>[] = []

  function StableProbe() {
    stable.push(useRoutes())
    return null
  }

  const { rerender } = harness.render(<StableProbe />)
  rerender(<StableProbe />)

  expect(stable).toHaveLength(2)
  expect(stable.at(1)).toBe(stable.at(0))
  expect(stable.at(1)?.url).toBe(stable.at(0)?.url)
  expect(stable.at(1)?.isActiveRoute).toBe(stable.at(0)?.isActiveRoute)
  expect(stable.at(1)?.parseLinkSpecifier).toBe(stable.at(0)?.parseLinkSpecifier)
})

test('useRoutes returns a new object after navigation', () => {
  const harness = createTestHarness()
  const stable: ReturnType<typeof useRoutes>[] = []

  function StableProbe() {
    stable.push(useRoutes())
    return null
  }

  const { rerender } = harness.render(<StableProbe />)
  harness.setRoute({ courseSlug: TEST_COURSE_SLUG, locale: 'en', name: 'app:course:progress' })
  rerender(<StableProbe />)

  expect(stable.at(1)).not.toBe(stable.at(0))
})

test('a memoised link child bails out on unrelated store changes', () => {
  const harness = createTestHarness()
  const rendersBefore = urlRenders.length

  harness.render(<MemoChildProbe />)
  act(() => {
    harness.store.dispatch(changeIsProcessing(true))
  })

  // MemoChildProbe re-rendered, but the memoised child received the same `url` reference and bailed out
  expect(urlRenders.length - rendersBefore).toBe(1)
})
