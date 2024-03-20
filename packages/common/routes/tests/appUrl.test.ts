import { expect, test } from 'vitest'

import RouteManager from '#routeManager'

test('RouteManager.getInstance returns singleton', () => {
  const routeManager = RouteManager.getInstance('URL', 'page', 'section')
  expect(routeManager).toBe(RouteManager.getInstance('URL', 'page', 'section'))
})

test('RouteManager.appUrl returns `app:index` path (URL mode)', () => {
  const routeManager = new RouteManager('URL', 'page', 'section')
  expect(
    routeManager.appUrl({
      name: 'app:index',
      locale: 'en',
    }),
  ).toBe('/en')
})

test('RouteManager.appUrl returns `app:course:index` path (URL mode)', () => {
  const routeManager = new RouteManager('URL', 'page', 'section')
  expect(
    routeManager.appUrl({
      name: 'app:course:index',
      courseSlug: 'awesome-course',
      locale: 'en',
    }),
  ).toBe('/en/awesome-course')
})

test('RouteManager.appUrl throws with invalid route info (URL mode)', () => {
  const routeManager = new RouteManager('URL', 'page', 'section')
  expect(() => {
    routeManager.appUrl({})
  }).toThrow(TypeError)
  expect(() => {
    routeManager.appUrl({ name: 'app:index' })
  }).toThrow(/Expected.+locale/)
  expect(() => {
    routeManager.appUrl({ name: 'app:course:index', locale: 'en' })
  }).toThrow(/Expected.+courseSlug/)
})

test('RouteManager.appUrl returns `app:index` path (SINGLE mode)', () => {
  const routeManager = new RouteManager('SINGLE', 'page', 'section')
  expect(
    routeManager.appUrl({
      name: 'app:index',
      locale: 'en',
    }),
  ).toBe('/en')
})

test('RouteManager.appUrl returns `app:course:index` path (SINGLE mode)', () => {
  const routeManager = new RouteManager('SINGLE', 'page', 'section')
  expect(
    routeManager.appUrl({
      name: 'app:course:index',
      locale: 'en',
    }),
  ).toBe('/en')
})

test('RouteManager.appUrl throws with invalid route info (SINGLE mode)', () => {
  const routeManager = new RouteManager('SINGLE', 'page', 'section')
  expect(() => {
    routeManager.appUrl({})
  }).toThrow(TypeError)
  expect(() => {
    routeManager.appUrl({ name: 'app:index' })
  }).toThrow(/Expected.+locale/)
})
