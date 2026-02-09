import { expect, test } from 'vitest'

import RouteManager from '#routeManager'

test('RouteManager.generateAppUrlPath returns `app:index` path (URL mode)', () => {
  const routeManager = new RouteManager('URL', 'page', 'section')
  expect(
    routeManager.generateAppUrlPath({
      name: 'app:index',
      locale: 'en',
    }),
  ).toBe('/en')
})

test('RouteManager.generateAppUrlPath returns `app:course:index` path (URL mode)', () => {
  const routeManager = new RouteManager('URL', 'page', 'section')
  expect(
    routeManager.generateAppUrlPath({
      name: 'app:course:index',
      courseSlug: 'awesome-course',
      locale: 'en',
    }),
  ).toBe('/en/awesome-course')
})

test('RouteManager.generateAppUrlPath throws with invalid route info (URL mode)', () => {
  const routeManager = new RouteManager('URL', 'page', 'section')
  expect(() => {
    routeManager.generateAppUrlPath({})
  }).toThrow(TypeError)
  expect(() => {
    routeManager.generateAppUrlPath({ name: 'app:index' })
  }).toThrow(/Expected.+locale/)
  expect(() => {
    routeManager.generateAppUrlPath({ name: 'app:course:index', locale: 'en' })
  }).toThrow(/Expected.+courseSlug/)
})

test('RouteManager.generateAppUrlPath returns `app:index` path (SINGLE mode)', () => {
  const routeManager = new RouteManager('SINGLE', 'page', 'section')
  expect(
    routeManager.generateAppUrlPath({
      name: 'app:index',
      locale: 'en',
    }),
  ).toBe('/en')
})

test('RouteManager.generateAppUrlPath returns `app:course:index` path (SINGLE mode)', () => {
  const routeManager = new RouteManager('SINGLE', 'page', 'section')
  expect(
    routeManager.generateAppUrlPath({
      name: 'app:course:index',
      locale: 'en',
    }),
  ).toBe('/en')
})

test('RouteManager.generateAppUrlPath throws with invalid route info (SINGLE mode)', () => {
  const routeManager = new RouteManager('SINGLE', 'page', 'section')
  expect(() => {
    routeManager.generateAppUrlPath({})
  }).toThrow(TypeError)
  expect(() => {
    routeManager.generateAppUrlPath({ name: 'app:index' })
  }).toThrow(/Expected.+locale/)
})
