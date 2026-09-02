import { expect, test, vi } from 'vitest'
import { RouteManager } from '@innodoc/shared-core/routes'
import makeStore from '@innodoc/shared-store'
import { changeRouteInfo, selectRouteInfo, selectRouteTransitionInfo } from '@innodoc/shared-store/slices/app'
import { makeRouteNavigator } from './route-navigator.js'

const routeManager = new RouteManager({
  config: {
    courseSlugMode: 'SINGLE',
    defaultCourseSlug: 'test-course',
    pagePathPrefix: 'page',
    sectionPathPrefix: 'section',
  },
})

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

test('a hash-only navigation on an unpublished-locale page is a same-route no-op', async () => {
  // The rendered route of `/fr/user/login`: `fr` is a valid ISO 639-1 code without a UI bundle,
  // so the store holds the document locale (`en`) while the URL keeps `fr`
  seedInitialState(['de', 'en'])
  setLocation('/fr/user/login', '', '#answer')
  // The fast path scrolls to the hash target
  globalThis.document = { querySelector: () => null } as unknown as Document

  const store = makeStore()
  store.dispatch(changeRouteInfo({ locale: 'en', name: 'app:user:login' }))
  const routeInfoBefore = selectRouteInfo(store.getState())

  const navigate = vi.fn()
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
