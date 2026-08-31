import { expect, test } from 'vitest'
import type { FrontendRouteInfo } from '@innodoc/shared-core/types'
import makeStore from '#make-store'
import { changeRouteInfo, selectRouteInfo } from '#slices/app'

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
