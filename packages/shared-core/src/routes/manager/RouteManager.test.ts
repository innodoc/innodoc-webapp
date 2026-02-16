import { expect, test, describe, beforeEach } from 'vitest'

import RouteManager from './RouteManager.js'

test('RouteManager.getInstance returns singleton', () => {
  const routeManager = RouteManager.getInstance('URL', 'page', 'section')
  expect(routeManager).toBe(RouteManager.getInstance('URL', 'page', 'section'))
})

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

describe('RouterManager::parseLinkSpecifier', () => {
  let routeManager: RouteManager

  beforeEach(() => {
    routeManager = RouteManager.getInstance('URL', 'page', 'section')
  })

  test('RouteManager.parseLinkSpecifier parses course page route', () => {
    expect(routeManager.parseLinkSpecifier('app:course:page|foo-bar')).toStrictEqual({
      name: 'app:course:page',
      pageSlug: 'foo-bar',
    })
  })

  test('RouteManager.parseLinkSpecifier parses course section route', () => {
    expect(routeManager.parseLinkSpecifier('app:course:section|foo/bar/baz')).toStrictEqual({
      name: 'app:course:section',
      sectionPath: 'foo/bar/baz',
    })
  })

  test('RouteManager.parseLinkSpecifier parses route w/o argument', () => {
    expect(routeManager.parseLinkSpecifier('app:index')).toStrictEqual({ name: 'app:index' })
  })

  test('RouteManager.parseLinkSpecifier throws with unknown route name', () => {
    expect(() => routeManager.parseLinkSpecifier('app:course:secti0n|foo/bar/baz')).toThrowError(TypeError)
  })

  test('RouteManager.parseLinkSpecifier throws with missing arg', () => {
    expect(() => routeManager.parseLinkSpecifier('app:course:section|')).toThrowError(TypeError)
    expect(() => routeManager.parseLinkSpecifier('app:course:section')).toThrowError(TypeError)
  })
})
