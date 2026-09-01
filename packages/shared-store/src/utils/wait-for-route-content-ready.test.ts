import { expect, test, vi } from 'vitest'
import { RouteManager } from '@innodoc/shared-core/routes'
import type {
  ApiRouteParams,
  ContentWithHash,
  CoursePageRouteInfo,
  CourseSectionRouteInfo,
  FrontendRouteInfo,
  HastResult,
} from '@innodoc/shared-core/types'
import makeStore from '#make-store'
import { changeRouteTransitionInfo } from '#slices/app'
import getPagesApi from '#slices/content/pages'
import getSectionsApi from '#slices/content/sections'
import { addHastResult } from '#slices/hast'
import { waitForRouteContentReady } from './wait-for-route-content-ready.js'

const COURSE_SLUG = 'test-course'
const HAST_ROOT: HastResult = { root: { type: 'root', children: [] } }

const routeManager = new RouteManager({
  config: {
    courseSlugMode: 'SINGLE',
    defaultCourseSlug: COURSE_SLUG,
    pagePathPrefix: 'page',
    sectionPathPrefix: 'section',
  },
})

const indexRoute: FrontendRouteInfo = { locale: 'en', name: 'app:index' }

const pageRoute: CoursePageRouteInfo = {
  courseSlug: COURSE_SLUG,
  locale: 'en',
  name: 'app:course:page',
  pageSlug: 'home',
}

const sectionRoute: CourseSectionRouteInfo = {
  courseSlug: COURSE_SLUG,
  locale: 'en',
  name: 'app:course:section',
  sectionPath: 'intro',
}

const pageContentArgs = {
  courseSlug: COURSE_SLUG,
  locale: 'en',
  pageSlug: 'home',
} satisfies ApiRouteParams['api:course:page:content']

const sectionContentArgs = {
  courseSlug: COURSE_SLUG,
  locale: 'en',
  sectionPath: 'intro',
} satisfies ApiRouteParams['api:course:section:content']

function makeContent(hash: string): ContentWithHash {
  return { content: `content ${hash}`, hash }
}

/** Seed a fulfilled content query and its hast result directly into the cache (no network) */
async function seedReadyPage(store: ReturnType<typeof makeStore>, hash: string) {
  await store.dispatch(
    getPagesApi(routeManager).util.upsertQueryData('getPageContent', pageContentArgs, makeContent(hash)),
  )
  store.dispatch(addHastResult({ hash, ...HAST_ROOT }))
}

test('non-content routes resolve immediately without building a content query', async () => {
  const store = makeStore()
  const selectSpy = vi.spyOn(getPagesApi(routeManager).endpoints.getPageContent, 'select')

  await waitForRouteContentReady(store, routeManager, indexRoute)

  expect(selectSpy).not.toHaveBeenCalled()
  selectSpy.mockRestore()
})

test('a page route stays pending until the query is fulfilled AND the hast result is present', async () => {
  const store = makeStore()
  let settled = false

  const waitPromise = waitForRouteContentReady(store, routeManager, pageRoute).finally(() => {
    settled = true
  })

  // Fulfilled query alone is not enough: the hast result is missing
  await store.dispatch(
    getPagesApi(routeManager).util.upsertQueryData('getPageContent', pageContentArgs, makeContent('abc')),
  )
  expect(settled).toBe(false)

  // The hast result makes it ready
  store.dispatch(addHastResult({ hash: 'abc', ...HAST_ROOT }))
  await waitPromise
  expect(settled).toBe(true)
})

test('a section route waits for its content the same way', async () => {
  const store = makeStore()
  let settled = false

  const waitPromise = waitForRouteContentReady(store, routeManager, sectionRoute).finally(() => {
    settled = true
  })

  // Uninitialised query: not ready yet
  expect(settled).toBe(false)

  await store.dispatch(
    getSectionsApi(routeManager).util.upsertQueryData('getSectionContent', sectionContentArgs, makeContent('def')),
  )
  store.dispatch(addHastResult({ hash: 'def', ...HAST_ROOT }))
  await waitPromise
  expect(settled).toBe(true)
})

test('an errored content query counts as ready, so the page error UI can render', async () => {
  const store = makeStore()

  const waitPromise = waitForRouteContentReady(store, routeManager, pageRoute)

  // The fixture baseQuery has no server for the relative API URL, so the query fails
  const result = await store.dispatch(getPagesApi(routeManager).endpoints.getPageContent.initiate(pageContentArgs))
  expect(result.isError).toBe(true)

  await waitPromise
})

test('an already-ready content route resolves immediately', async () => {
  const store = makeStore()
  await seedReadyPage(store, 'ready')

  let settled = false
  await waitForRouteContentReady(store, routeManager, pageRoute).finally(() => {
    settled = true
  })
  expect(settled).toBe(true)
})

test('the wait resolves on timeout when the content never arrives', async () => {
  const store = makeStore()
  vi.useFakeTimers()

  try {
    let settled = false
    const waitPromise = waitForRouteContentReady(store, routeManager, pageRoute, { timeoutMs: 1000 }).finally(() => {
      settled = true
    })
    expect(settled).toBe(false)

    vi.advanceTimersByTime(1000)
    await waitPromise
    expect(settled).toBe(true)
  } finally {
    vi.useRealTimers()
  }
})

test('endpoint.select is called once per wait, not once per dispatched action', async () => {
  const store = makeStore()
  const selectSpy = vi.spyOn(getPagesApi(routeManager).endpoints.getPageContent, 'select')

  const waitPromise = waitForRouteContentReady(store, routeManager, pageRoute)

  // The selector is prepared once, before the subscription (it used to be rebuilt for
  // every action dispatched while waiting)
  expect(selectSpy).toHaveBeenCalledTimes(1)

  store.dispatch(changeRouteTransitionInfo(pageRoute))
  store.dispatch(changeRouteTransitionInfo(null))
  expect(selectSpy).toHaveBeenCalledTimes(1)

  // Settle the wait. RTK Query internals may call select during the upsert itself, so the count
  // is only asserted about the waiting machinery above
  await store.dispatch(
    getPagesApi(routeManager).util.upsertQueryData('getPageContent', pageContentArgs, makeContent('abc')),
  )
  store.dispatch(addHastResult({ hash: 'abc', ...HAST_ROOT }))
  await waitPromise

  selectSpy.mockRestore()
})
