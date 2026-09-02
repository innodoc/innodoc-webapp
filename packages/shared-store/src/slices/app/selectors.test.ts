import { expect, test } from 'vitest'
import type { FrontendRouteInfo } from '@innodoc/shared-core/types'
import makeStore from '#make-store'
import { changeRouteInfo, changeRouteTransitionInfo, selectRouteInfo, selectRouteTransitionInfo } from '#slices/app'

test('selectRouteInfo returns the initial route info', () => {
  const store = makeStore()

  expect(selectRouteInfo(store.getState())).toMatchObject({ name: 'app:index', locale: 'en' })
})

test('selectRouteInfo returns the route info set by changeRouteInfo', () => {
  const store = makeStore()
  const next: FrontendRouteInfo = { courseSlug: 'test-course', locale: 'de', name: 'app:course:index' }

  store.dispatch(changeRouteInfo(next))

  // toBe: the selector is a direct lookup and must return the stored reference, not a copy
  expect(selectRouteInfo(store.getState())).toBe(next)
})

test('selectRouteTransitionInfo reports the navigation in flight, and null when there is none', () => {
  const store = makeStore()
  const next: FrontendRouteInfo = { courseSlug: 'test-course', locale: 'en', name: 'app:course:page', pageSlug: 'home' }

  expect(selectRouteTransitionInfo(store.getState())).toBeNull()

  store.dispatch(changeRouteTransitionInfo(next))

  expect(selectRouteTransitionInfo(store.getState())).toBe(next)

  store.dispatch(changeRouteTransitionInfo(null))

  expect(selectRouteTransitionInfo(store.getState())).toBeNull()
})
