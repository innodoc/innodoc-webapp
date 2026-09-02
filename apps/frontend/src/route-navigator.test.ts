import type { NavigateOptions } from 'wouter'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { RouteManager } from '@innodoc/shared-core/routes'
import type { ApiCourse, ContentWithHash, HastResult, LanguageCode } from '@innodoc/shared-core/types'
import makeStore from '@innodoc/shared-store'
import { changeRouteInfo, selectRouteInfo, selectRouteTransitionInfo } from '@innodoc/shared-store/slices/app'
import getCoursesApi from '@innodoc/shared-store/slices/content/courses'
import getPagesApi from '@innodoc/shared-store/slices/content/pages'
import { addHastResult } from '@innodoc/shared-store/slices/hast'
import type { Store } from '@innodoc/shared-store/types'
import { makeRouteNavigator } from './route-navigator.js'

const COURSE_SLUG = 'test-course'

const routeManager = new RouteManager({
  config: {
    courseSlugMode: 'SINGLE',
    defaultCourseSlug: COURSE_SLUG,
    pagePathPrefix: 'page',
    sectionPathPrefix: 'section',
  },
})

const HAST_ROOT: HastResult = { root: { type: 'root', children: [] } }

/** The client reads the supported locales off the seeded initial state */
function seedInitialState(supportedLocales: string[]) {
  globalThis.__initial_state__ = {
    locale: supportedLocales[0] ?? 'en',
    preloadedState: makeStore().getState(),
    supportedLocales,
  }
}

function setLocation(pathname: string, search = '', hash = '') {
  globalThis.location = { pathname, search, hash } as Location
}

/** The history entry commit the navigator writes (the `this`-free core of `History['pushState']`) */
type HistoryCommit = (data: unknown, unused: string, url?: string | null) => void

/** Origin the course fetch resolves its relative URL against: Node has none of its own */
const MOCK_ORIGIN = 'http://mock.local'

/**
 * Node resolves a relative URL against nothing - `new Request('/api/...')` throws - so RTK Query's
 * fetch could never run in this environment. Resolve it against a fixed origin instead, the same
 * trick the RTL setup applies (ui-test-utils' stub-globals).
 */
class TestRequest extends Request {
  constructor(input: RequestInfo | URL, init?: RequestInit) {
    super(typeof input === 'string' ? new URL(input, MOCK_ORIGIN).href : input, init)
  }
}

let pushState: HistoryCommit
let replaceState: HistoryCommit

// The navigator reads the URL it is committing off `location` when it scrolls: stub the browser
// globals a node environment does not have, and keep them per-test
beforeEach(() => {
  seedInitialState(['de', 'en'])
  setLocation('/en')
  globalThis.document = { querySelector: () => null } as unknown as Document
  globalThis.scrollTo = vi.fn<() => void>()
  pushState = vi.fn<HistoryCommit>()
  replaceState = vi.fn<HistoryCommit>()
  globalThis.history = { pushState, replaceState } as unknown as History
})

// The tests that stub the course fetch restore the real globals
afterEach(() => {
  vi.unstubAllGlobals()
})

/** The course the tests navigate in: the fixture's first locale is `de`, so a corrected target
 * differs from the app default */
function makeCourseRecord(locales: LanguageCode[]): ApiCourse {
  return {
    id: 1,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    slug: COURSE_SLUG,
    title: { de: 'Testkurs', en: 'Test course' },
    shortTitle: null,
    description: null,
    homeLink: 'app:course:page|home',
    locales,
  }
}

/** Put the course into the RTK Query cache the way a fulfilled fetch would */
function seedCourse(store: Store, locales: LanguageCode[]) {
  return store.dispatch(
    getCoursesApi(routeManager).util.upsertQueryData('getCourse', { courseSlug: COURSE_SLUG }, makeCourseRecord(locales)),
  )
}

/** Seed the home page's content query as fulfilled, with its hast result (no network) */
function seedPageContent(store: Store, locale: LanguageCode) {
  const args = { courseSlug: COURSE_SLUG, locale, pageSlug: 'home' }
  const content: ContentWithHash = { content: `home in ${locale}`, hash: `home-${locale}` }

  return Promise.all([
    store.dispatch(getPagesApi(routeManager).util.upsertQueryData('getPageContent', args, content)),
    Promise.resolve(store.dispatch(addHastResult({ hash: content.hash, ...HAST_ROOT }))),
  ])
}

test('a hash-only navigation on an unpublished-locale page is a same-route no-op', async () => {
  // The rendered route of `/fr/user/login`: `fr` is a valid ISO 639-1 code without a UI bundle,
  // so the store holds the document locale (`en`) while the URL keeps `fr`
  setLocation('/fr/user/login', '', '#answer')

  const store = makeStore()
  store.dispatch(changeRouteInfo({ locale: 'en', name: 'app:user:login' }))
  const routeInfoBefore = selectRouteInfo(store.getState())

  const navigate = vi.fn<(to: string, options?: NavigateOptions) => void>()
  makeRouteNavigator(routeManager, store).aroundNav(navigate, '/fr/user/login#answer', {})

  // Let any (incorrect) full transition pipeline run to completion
  await new Promise((resolve) => setImmediate(resolve))

  // The fast path moved the URL and left the rendered route alone: no content reload, no
  // transition state
  expect(navigate).toHaveBeenCalledTimes(1)
  expect(navigate).toHaveBeenCalledWith('/fr/user/login#answer', {})
  expect(selectRouteInfo(store.getState())).toBe(routeInfoBefore)
  expect(selectRouteTransitionInfo(store.getState())).toBeNull()
})

test("a navigation to a course locale the course does not offer commits the course's first locale and rewrites the URL", async () => {
  const store = makeStore()
  store.dispatch(changeRouteInfo({ locale: 'en', name: 'app:index' }))
  await seedCourse(store, ['de', 'en'])
  await seedPageContent(store, 'de')

  const navigate = vi.fn<(to: string, options?: NavigateOptions) => void>()
  makeRouteNavigator(routeManager, store).aroundNav(navigate, '/fr/page/home?tab=2#answer', {})

  await vi.waitFor(() => {
    expect(selectRouteInfo(store.getState()).name).toBe('app:course:page')
  })

  // The canonical target the SSR redirect would have produced: the course's first locale, with
  // the reader's search and hash kept
  expect(selectRouteInfo(store.getState())).toEqual({
    courseSlug: COURSE_SLUG,
    locale: 'de',
    name: 'app:course:page',
    pageSlug: 'home',
  })
  expect(selectRouteTransitionInfo(store.getState())).toBeNull()
  // The dead URL never entered the history: the canonical one was committed in its place
  expect(navigate).toHaveBeenCalledTimes(1)
  expect(navigate).toHaveBeenCalledWith('/de/page/home?tab=2#answer', { replace: true })
  // The committed route's content is ready, not an error
  const query = getPagesApi(routeManager).endpoints.getPageContent.select({
    courseSlug: COURSE_SLUG,
    locale: 'de',
    pageSlug: 'home',
  })
  expect(query(store.getState()).isSuccess).toBe(true)
})

test('a navigation to a course locale the course does not offer fetches the uncached course and then corrects', async () => {
  const store = makeStore()
  store.dispatch(changeRouteInfo({ locale: 'en', name: 'app:index' }))
  // The course record is deliberately not in the cache: the navigator has to fetch it before it
  // can tell that `fr` is not offered. The corrected locale's content is ready, like in the cached
  // variant above
  await seedPageContent(store, 'de')

  // The only request this navigation makes on its own is the course record. Anything else is a
  // test bug, so the fetch answers only for it and fails loudly otherwise
  const courseUrl = `${MOCK_ORIGIN}/api/course/${COURSE_SLUG}`
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = new Request(input).url
    if (url !== courseUrl) {
      throw new Error(`Unexpected request: ${url}`)
    }
    return Response.json(makeCourseRecord(['de', 'en']))
  })
  vi.stubGlobal('Request', TestRequest)
  vi.stubGlobal('fetch', fetchMock)

  const navigate = vi.fn<(to: string, options?: NavigateOptions) => void>()
  makeRouteNavigator(routeManager, store).aroundNav(navigate, '/fr/page/home', {})

  await vi.waitFor(() => {
    expect(selectRouteInfo(store.getState()).name).toBe('app:course:page')
  })

  // The canonical target the SSR redirect would have produced: the course's first locale
  expect(selectRouteInfo(store.getState())).toEqual({
    courseSlug: COURSE_SLUG,
    locale: 'de',
    name: 'app:course:page',
    pageSlug: 'home',
  })
  expect(selectRouteTransitionInfo(store.getState())).toBeNull()
  // The dead URL never entered the history: the canonical one was committed in its place
  expect(navigate).toHaveBeenCalledTimes(1)
  expect(navigate).toHaveBeenCalledWith('/de/page/home', { replace: true })
  // The course record arrived from the fetch, not a seed
  expect(fetchMock).toHaveBeenCalledTimes(1)
  const courseQuery = getCoursesApi(routeManager).endpoints.getCourse.select({ courseSlug: COURSE_SLUG })
  expect(courseQuery(store.getState()).isSuccess).toBe(true)
  expect(courseQuery(store.getState()).data?.locales).toEqual(['de', 'en'])
  // The content is ready for the corrected locale, and the dead locale never reached a query, so
  // nothing can render an error for it
  const deadContent = getPagesApi(routeManager).endpoints.getPageContent.select({
    courseSlug: COURSE_SLUG,
    locale: 'fr',
    pageSlug: 'home',
  })
  expect(deadContent(store.getState()).status).toBe('uninitialized')
  const correctedContent = getPagesApi(routeManager).endpoints.getPageContent.select({
    courseSlug: COURSE_SLUG,
    locale: 'de',
    pageSlug: 'home',
  })
  expect(correctedContent(store.getState()).isSuccess).toBe(true)
})

test('a navigation to an unresolvable course proceeds uncorrected once the course fetch has errored', async () => {
  const store = makeStore()
  store.dispatch(changeRouteInfo({ locale: 'en', name: 'app:index' }))

  // The course does not exist: the fetch the navigator starts answers 404
  const fetchMock = vi.fn(async () => new Response(null, { status: 404 }))
  vi.stubGlobal('Request', TestRequest)
  vi.stubGlobal('fetch', fetchMock)

  const navigate = vi.fn<(to: string, options?: NavigateOptions) => void>()
  makeRouteNavigator(routeManager, store).aroundNav(navigate, '/fr/toc', {})

  // The navigation must not hang on the dead fetch: it proceeds uncorrected, as before the course
  // fetch existed, and the content fetch answers it (with an error) once the page's own data loads
  await vi.waitFor(() => {
    expect(selectRouteInfo(store.getState()).name).toBe('app:course:toc')
  })

  expect(fetchMock).toHaveBeenCalledTimes(1)
  const courseQuery = getCoursesApi(routeManager).endpoints.getCourse.select({ courseSlug: COURSE_SLUG })
  expect(courseQuery(store.getState()).isError).toBe(true)
  expect(navigate).toHaveBeenCalledTimes(1)
  expect(navigate).toHaveBeenCalledWith('/fr/toc', {})
  expect(selectRouteInfo(store.getState()).locale).toBe('en')
})

test('a repeated navigation to the unoffered locale is a no-op once the corrected page is rendered', async () => {
  const store = makeStore()
  await seedCourse(store, ['de', 'en'])
  store.dispatch(changeRouteInfo({ courseSlug: COURSE_SLUG, locale: 'de', name: 'app:course:page', pageSlug: 'home' }))
  const routeInfoBefore = selectRouteInfo(store.getState())

  const navigate = vi.fn<(to: string, options?: NavigateOptions) => void>()
  makeRouteNavigator(routeManager, store).aroundNav(navigate, '/fr/page/home', {})

  // Let the pipeline reach its fast path: the course is cached, so no await holds it back
  await new Promise((resolve) => setImmediate(resolve))

  // The corrected target is the rendered route: the fast path takes it, nothing is refetched, and
  // the dead URL is not committed - the canonical one, as a replace. No ping-pong: the redirect
  // target is always a locale the course offers.
  expect(navigate).toHaveBeenCalledTimes(1)
  expect(navigate).toHaveBeenCalledWith('/de/page/home', { replace: true })
  expect(selectRouteInfo(store.getState())).toBe(routeInfoBefore)
  expect(selectRouteTransitionInfo(store.getState())).toBeNull()
})

test('a history navigation to a dead course-locale entry commits the canonical route and rewrites the entry in place', async () => {
  const store = makeStore()
  store.dispatch(changeRouteInfo({ locale: 'en', name: 'app:index' }))
  await seedCourse(store, ['de', 'en'])
  await seedPageContent(store, 'de')

  // The browser moved the address bar to a stale entry the course does not serve and reported it
  // as a popstate: the app answers it alone
  setLocation('/fr/page/home')

  makeRouteNavigator(routeManager, store).syncWithLocation()

  await vi.waitFor(() => {
    expect(selectRouteInfo(store.getState()).name).toBe('app:course:page')
  })

  expect(selectRouteInfo(store.getState()).locale).toBe('de')
  expect(selectRouteTransitionInfo(store.getState())).toBeNull()
  // The dead entry is rewritten in place: a replace, never a push - the next back press leaves it
  // entirely instead of stranding on it
  expect(replaceState).toHaveBeenCalledTimes(1)
  expect(replaceState).toHaveBeenCalledWith(null, '', '/de/page/home')
  expect(pushState).not.toHaveBeenCalled()
})

test('a history navigation to the rendered route writes no URL', async () => {
  const store = makeStore()
  await seedCourse(store, ['de', 'en'])
  store.dispatch(changeRouteInfo({ courseSlug: COURSE_SLUG, locale: 'de', name: 'app:course:page', pageSlug: 'home' }))
  const routeInfoBefore = selectRouteInfo(store.getState())

  // The entry names the route the store already renders, in a locale the course offers
  setLocation('/de/page/home')

  makeRouteNavigator(routeManager, store).syncWithLocation()

  // Let the pipeline reach its fast path: the course is cached, so no await holds it back
  await new Promise((resolve) => setImmediate(resolve))

  // The URL is where the reader asked to be: one back press must not become a step forward
  expect(pushState).not.toHaveBeenCalled()
  expect(replaceState).not.toHaveBeenCalled()
  expect(selectRouteInfo(store.getState())).toBe(routeInfoBefore)
})
