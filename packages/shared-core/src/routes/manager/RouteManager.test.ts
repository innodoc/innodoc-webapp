import { expect, test } from 'vitest'
import RouteManager from './RouteManager.js'

test('RouteManager.generateAppUrlPath returns `app:index` path (URL mode)', () => {
  const config = { courseSlugMode: 'URL', pagePathPrefix: 'page', sectionPathPrefix: 'section' } as const
  const routeManager = new RouteManager({ config })
  expect(
    routeManager.generateFrontendUrlPath({
      name: 'app:index',
      locale: 'en',
    }),
  ).toBe('/en')
})

test('RouteManager.generateAppUrlPath returns `app:course:index` path (URL mode)', () => {
  const config = { courseSlugMode: 'URL', pagePathPrefix: 'page', sectionPathPrefix: 'section' } as const
  const routeManager = new RouteManager({ config })
  expect(
    routeManager.generateFrontendUrlPath({
      name: 'app:course:index',
      courseSlug: 'awesome-course',
      locale: 'en',
    }),
  ).toBe('/en/awesome-course')
})

test('RouteManager.generateAppUrlPath throws with invalid route info (URL mode)', () => {
  const config = { courseSlugMode: 'URL', pagePathPrefix: 'page', sectionPathPrefix: 'section' } as const
  const routeManager = new RouteManager({ config })
  expect(() => {
    routeManager.generateFrontendUrlPath({})
  }).toThrow(TypeError)
  expect(() => {
    routeManager.generateFrontendUrlPath({ name: 'app:index' })
  }).toThrow(/Expected.+locale/)
  expect(() => {
    routeManager.generateFrontendUrlPath({ name: 'app:course:index', locale: 'en' })
  }).toThrow(/Expected.+courseSlug/)
})

test('RouteManager.generateAppUrlPath returns `app:index` path (SINGLE mode)', () => {
  const config = { courseSlugMode: 'SINGLE', pagePathPrefix: 'page', sectionPathPrefix: 'section' } as const
  const routeManager = new RouteManager({ config })
  expect(
    routeManager.generateFrontendUrlPath({
      name: 'app:index',
      locale: 'en',
    }),
  ).toBe('/en')
})

test('RouteManager.generateAppUrlPath returns `app:course:index` path (SINGLE mode)', () => {
  const config = { courseSlugMode: 'SINGLE', pagePathPrefix: 'page', sectionPathPrefix: 'section' } as const
  const routeManager = new RouteManager({ config })
  expect(
    routeManager.generateFrontendUrlPath({
      name: 'app:course:index',
      locale: 'en',
    }),
  ).toBe('/en')
})

test('RouteManager.generateAppUrlPath throws with invalid route info (SINGLE mode)', () => {
  const config = { courseSlugMode: 'SINGLE', pagePathPrefix: 'page', sectionPathPrefix: 'section' } as const
  const routeManager = new RouteManager({ config })
  expect(() => {
    routeManager.generateFrontendUrlPath({})
  }).toThrow(TypeError)
  expect(() => {
    routeManager.generateFrontendUrlPath({ name: 'app:index' })
  }).toThrow(/Expected.+locale/)
})

test('RouteManager.parseLinkSpecifier parses course page route', () => {
  const config = { courseSlugMode: 'URL', pagePathPrefix: 'page', sectionPathPrefix: 'section' } as const
  const routeManager = new RouteManager({ config })
  expect(routeManager.parseLinkSpecifier('app:course:page|foo-bar')).toStrictEqual({
    name: 'app:course:page',
    pageSlug: 'foo-bar',
  })
})

test('RouteManager.parseLinkSpecifier parses course section route', () => {
  const config = { courseSlugMode: 'URL', pagePathPrefix: 'page', sectionPathPrefix: 'section' } as const
  const routeManager = new RouteManager({ config })
  expect(routeManager.parseLinkSpecifier('app:course:section|foo/bar/baz')).toStrictEqual({
    name: 'app:course:section',
    sectionPath: 'foo/bar/baz',
  })
})

test('RouteManager.parseLinkSpecifier parses route w/o argument', () => {
  const config = { courseSlugMode: 'URL', pagePathPrefix: 'page', sectionPathPrefix: 'section' } as const
  const routeManager = new RouteManager({ config })
  expect(routeManager.parseLinkSpecifier('app:index')).toStrictEqual({ name: 'app:index' })
})

test('RouteManager.parseLinkSpecifier throws with unknown route name', () => {
  const config = { courseSlugMode: 'URL', pagePathPrefix: 'page', sectionPathPrefix: 'section' } as const
  const routeManager = new RouteManager({ config })
  expect(() => routeManager.parseLinkSpecifier('app:course:secti0n|foo/bar/baz')).toThrowError(TypeError)
})

test('RouteManager.parseLinkSpecifier throws with missing arg', () => {
  const config = { courseSlugMode: 'URL', pagePathPrefix: 'page', sectionPathPrefix: 'section' } as const
  const routeManager = new RouteManager({ config })
  expect(() => routeManager.parseLinkSpecifier('app:course:section|')).toThrowError(TypeError)
  expect(() => routeManager.parseLinkSpecifier('app:course:section')).toThrowError(TypeError)
})
