import { expect, test } from 'vitest'

import RouteManager from '#routeManager'

test('RouteManager.getInstance returns singleton', () => {
  const routeManager = RouteManager.getInstance('URL', 'page', 'section')
  expect(routeManager).toBe(RouteManager.getInstance('URL', 'page', 'section'))
})
