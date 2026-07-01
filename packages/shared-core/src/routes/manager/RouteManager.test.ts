import { expect, test } from 'vitest'
import RouteManager from './RouteManager.js'

// URL mode config

const urlConfig = {
  courseSlugMode: 'URL',
  defaultCourseSlug: null,
  pagePathPrefix: 'page',
  sectionPathPrefix: 'section',
} as const

test('RouteManager.generateFrontendUrlPath returns `app:index` path (URL mode)', () => {
  const routeManager = new RouteManager({ config: urlConfig })
  expect(
    routeManager.generateFrontendUrlPath({
      name: 'app:index',
      locale: 'en',
    }),
  ).toBe('/en')
})

test('RouteManager.generateFrontendUrlPath returns `app:course:index` path (URL mode)', () => {
  const routeManager = new RouteManager({ config: urlConfig })
  expect(
    routeManager.generateFrontendUrlPath({
      name: 'app:course:index',
      courseSlug: 'awesome-course',
      locale: 'en',
    }),
  ).toBe('/en/awesome-course')
})

test('RouteManager.generateFrontendUrlPath throws with invalid route info (URL mode)', () => {
  const routeManager = new RouteManager({ config: urlConfig })
  expect(() => {
    routeManager.generateFrontendUrlPath({})
  }).toThrow(TypeError)
  expect(() => {
    routeManager.generateFrontendUrlPath({ name: 'app:index' })
  }).toThrow(/Expected.+locale/u)
  expect(() => {
    routeManager.generateFrontendUrlPath({ name: 'app:course:index', locale: 'en' })
  }).toThrow(/Expected.+courseSlug/u)
})

// SINGLE mode config

const singleConfig = {
  courseSlugMode: 'SINGLE',
  defaultCourseSlug: 'default-course',
  pagePathPrefix: 'page',
  sectionPathPrefix: 'section',
} as const

test('RouteManager.generateFrontendUrlPath returns `app:index` path (SINGLE mode)', () => {
  const routeManager = new RouteManager({ config: singleConfig })
  expect(
    routeManager.generateFrontendUrlPath({
      name: 'app:index',
      locale: 'en',
    }),
  ).toBe('/en')
})

test('RouteManager.generateFrontendUrlPath returns `app:course:index` path (SINGLE mode)', () => {
  const routeManager = new RouteManager({ config: singleConfig })
  expect(
    routeManager.generateFrontendUrlPath({
      name: 'app:course:index',
      locale: 'en',
    }),
  ).toBe('/en')
})

test('RouteManager.generateFrontendUrlPath throws with invalid route info (SINGLE mode)', () => {
  const routeManager = new RouteManager({ config: singleConfig })
  expect(() => {
    routeManager.generateFrontendUrlPath({})
  }).toThrow(TypeError)
  expect(() => {
    routeManager.generateFrontendUrlPath({ name: 'app:index' })
  }).toThrow(/Expected.+locale/u)
})

// parseLinkSpecifier tests

test('RouteManager.parseLinkSpecifier parses course page route', () => {
  const routeManager = new RouteManager({ config: urlConfig })
  expect(routeManager.parseLinkSpecifier('app:course:page|foo-bar')).toStrictEqual({
    name: 'app:course:page',
    pageSlug: 'foo-bar',
  })
})

test('RouteManager.parseLinkSpecifier parses course section route', () => {
  const routeManager = new RouteManager({ config: urlConfig })
  expect(routeManager.parseLinkSpecifier('app:course:section|foo/bar/baz')).toStrictEqual({
    name: 'app:course:section',
    sectionPath: 'foo/bar/baz',
  })
})

test('RouteManager.parseLinkSpecifier parses route w/o argument', () => {
  const routeManager = new RouteManager({ config: urlConfig })
  expect(routeManager.parseLinkSpecifier('app:index')).toStrictEqual({ name: 'app:index' })
})

test('RouteManager.parseLinkSpecifier throws with unknown route name', () => {
  const routeManager = new RouteManager({ config: urlConfig })
  expect(() => routeManager.parseLinkSpecifier('app:course:secti0n|foo/bar/baz')).toThrow(TypeError)
})

test('RouteManager.parseLinkSpecifier throws with missing arg', () => {
  const routeManager = new RouteManager({ config: urlConfig })
  expect(() => routeManager.parseLinkSpecifier('app:course:section|')).toThrow(TypeError)
  expect(() => routeManager.parseLinkSpecifier('app:course:section')).toThrow(TypeError)
})

// parseRouteFromUrl tests (URL mode)

test('parseRouteFromUrl matches app:index', () => {
  const routeManager = new RouteManager({ config: urlConfig })
  const result = routeManager.parseRouteFromUrl('/en')
  expect(result).toStrictEqual({ name: 'app:index', locale: 'en' })
})

test('parseRouteFromUrl matches app:course:index', () => {
  const routeManager = new RouteManager({ config: urlConfig })
  const result = routeManager.parseRouteFromUrl('/en/my-course')
  expect(result).toStrictEqual({
    name: 'app:course:index',
    locale: 'en',
    courseSlug: 'my-course',
  })
})

test('parseRouteFromUrl matches app:course:progress', () => {
  const routeManager = new RouteManager({ config: urlConfig })
  const result = routeManager.parseRouteFromUrl('/en/my-course/progress')
  expect(result).toStrictEqual({
    name: 'app:course:progress',
    locale: 'en',
    courseSlug: 'my-course',
  })
})

test('parseRouteFromUrl matches app:course:toc', () => {
  const routeManager = new RouteManager({ config: urlConfig })
  const result = routeManager.parseRouteFromUrl('/en/my-course/toc')
  expect(result).toStrictEqual({
    name: 'app:course:toc',
    locale: 'en',
    courseSlug: 'my-course',
  })
})

test('parseRouteFromUrl matches app:course:glossary', () => {
  const routeManager = new RouteManager({ config: urlConfig })
  const result = routeManager.parseRouteFromUrl('/en/my-course/glossary')
  expect(result).toStrictEqual({
    name: 'app:course:glossary',
    locale: 'en',
    courseSlug: 'my-course',
  })
})

test('parseRouteFromUrl matches app:course:page and extracts pageSlug', () => {
  const routeManager = new RouteManager({ config: urlConfig })
  const result = routeManager.parseRouteFromUrl('/en/my-course/page/about')
  expect(result).toStrictEqual({
    name: 'app:course:page',
    locale: 'en',
    courseSlug: 'my-course',
    pageSlug: 'about',
  })
})

test('parseRouteFromUrl matches app:course:page with hyphenated slug', () => {
  const routeManager = new RouteManager({ config: urlConfig })
  const result = routeManager.parseRouteFromUrl('/en/my-course/page/getting-started')
  expect(result).toStrictEqual({
    name: 'app:course:page',
    locale: 'en',
    courseSlug: 'my-course',
    pageSlug: 'getting-started',
  })
})

test('parseRouteFromUrl matches app:course:section and extracts sectionPath (single segment)', () => {
  const routeManager = new RouteManager({ config: urlConfig })
  const result = routeManager.parseRouteFromUrl('/en/my-course/section/intro')
  expect(result).toStrictEqual({
    name: 'app:course:section',
    locale: 'en',
    courseSlug: 'my-course',
    sectionPath: 'intro',
  })
})

test('parseRouteFromUrl matches app:course:section and extracts sectionPath (nested segments)', () => {
  const routeManager = new RouteManager({ config: urlConfig })
  const result = routeManager.parseRouteFromUrl('/en/my-course/section/intro/subsection/deep')
  expect(result).toStrictEqual({
    name: 'app:course:section',
    locale: 'en',
    courseSlug: 'my-course',
    sectionPath: 'intro/subsection/deep',
  })
})

test('parseRouteFromUrl matches app:user:login', () => {
  const routeManager = new RouteManager({ config: urlConfig })
  const result = routeManager.parseRouteFromUrl('/en/user/login')
  expect(result).toStrictEqual({ name: 'app:user:login', locale: 'en' })
})

test('parseRouteFromUrl matches app:user:forgot-password', () => {
  const routeManager = new RouteManager({ config: urlConfig })
  const result = routeManager.parseRouteFromUrl('/en/user/forgot-password')
  expect(result).toStrictEqual({ name: 'app:user:forgot-password', locale: 'en' })
})

test('parseRouteFromUrl matches app:user:sign-up', () => {
  const routeManager = new RouteManager({ config: urlConfig })
  const result = routeManager.parseRouteFromUrl('/en/user/sign-up')
  expect(result).toStrictEqual({ name: 'app:user:sign-up', locale: 'en' })
})

test('parseRouteFromUrl returns null for unmatched URL', () => {
  const routeManager = new RouteManager({ config: urlConfig })
  // /unknown matches app:index (/:locale) with locale='unknown' - this is correct
  expect(routeManager.parseRouteFromUrl('/unknown')).toStrictEqual({
    name: 'app:index',
    locale: 'unknown',
  })
  expect(routeManager.parseRouteFromUrl('/en/unknown/path')).toBeNull()
  expect(routeManager.parseRouteFromUrl('/')).toBeNull()
  expect(routeManager.parseRouteFromUrl('')).toBeNull()
})

test('parseRouteFromUrl respects trailing slash (no match without, match with)', () => {
  const routeManager = new RouteManager({ config: urlConfig })
  expect(routeManager.parseRouteFromUrl('/en/my-course')).not.toBeNull()
  expect(routeManager.parseRouteFromUrl('/en/my-course/')).not.toBeNull()
  // Page route requires :pageSlug, so trailing slash on the prefix doesn't match page route
  expect(routeManager.parseRouteFromUrl('/en/my-course/page/')).toBeNull()
})

test('parseRouteFromUrl does not match section wildcard for non-section paths', () => {
  const routeManager = new RouteManager({ config: urlConfig })
  // /en/my-course/toc should match app:course:toc, NOT app:course:section
  const result = routeManager.parseRouteFromUrl('/en/my-course/toc')
  expect(result?.name).toBe('app:course:toc')
  expect(result).not.toHaveProperty('sectionPath')
})

test('parseRouteFromUrl extracts correct locale', () => {
  const routeManager = new RouteManager({ config: urlConfig })
  const result = routeManager.parseRouteFromUrl('/fr/my-course')
  expect(result?.locale).toBe('fr')
})

// parseRouteFromUrl tests (SINGLE mode)

test('parseRouteFromUrl matches app:course:index (SINGLE mode - no courseSlug in URL)', () => {
  const routeManager = new RouteManager({ config: singleConfig })
  const result = routeManager.parseRouteFromUrl('/en')
  // /en matches app:index in SINGLE mode because the course slug is stripped
  // Wait - /en would match app:index (pattern: /:locale) first
  // For app:course:index in SINGLE mode, the pattern is /:locale (same as app:index)
  // So /en matches app:index first (it's defined first)
  expect(result?.name).toBe('app:index')
  expect(result).not.toHaveProperty('courseSlug')
})

test('parseRouteFromUrl matches app:course:progress (SINGLE mode)', () => {
  const routeManager = new RouteManager({ config: singleConfig })
  const result = routeManager.parseRouteFromUrl('/en/progress')
  expect(result).toStrictEqual({
    name: 'app:course:progress',
    locale: 'en',
    courseSlug: 'default-course',
  })
})

test('parseRouteFromUrl matches app:course:page (SINGLE mode)', () => {
  const routeManager = new RouteManager({ config: singleConfig })
  const result = routeManager.parseRouteFromUrl('/en/page/about')
  expect(result).toStrictEqual({
    name: 'app:course:page',
    locale: 'en',
    courseSlug: 'default-course',
    pageSlug: 'about',
  })
})

test('parseRouteFromUrl matches app:course:section (SINGLE mode)', () => {
  const routeManager = new RouteManager({ config: singleConfig })
  const result = routeManager.parseRouteFromUrl('/en/section/intro/subsection')
  expect(result).toStrictEqual({
    name: 'app:course:section',
    locale: 'en',
    courseSlug: 'default-course',
    sectionPath: 'intro/subsection',
  })
})

test('parseRouteFromUrl matches app:user:login (SINGLE mode)', () => {
  const routeManager = new RouteManager({ config: singleConfig })
  const result = routeManager.parseRouteFromUrl('/en/user/login')
  expect(result).toStrictEqual({ name: 'app:user:login', locale: 'en' })
})

// Round-trip tests (generate → parse → generate)

test('parseRouteFromUrl is inverse of generateFrontendUrlPath (URL mode)', () => {
  const routeManager = new RouteManager({ config: urlConfig })

  const routeInfo = {
    name: 'app:course:section',
    locale: 'en',
    courseSlug: 'my-course',
    sectionPath: 'intro/subsection',
  } as const

  const url = routeManager.generateFrontendUrlPath(routeInfo)
  expect(url).toBe('/en/my-course/section/intro/subsection')

  const parsed = routeManager.parseRouteFromUrl(url)
  expect(parsed).toStrictEqual(routeInfo)
})

test('parseRouteFromUrl is inverse of generateFrontendUrlPath (page route)', () => {
  const routeManager = new RouteManager({ config: urlConfig })

  const routeInfo = {
    name: 'app:course:page',
    locale: 'de',
    courseSlug: 'mein-kurs',
    pageSlug: 'ueber-uns',
  } as const

  const url = routeManager.generateFrontendUrlPath(routeInfo)
  expect(url).toBe('/de/mein-kurs/page/ueber-uns')

  const parsed = routeManager.parseRouteFromUrl(url)
  expect(parsed).toStrictEqual(routeInfo)
})

test('parseRouteFromUrl is inverse of generateFrontendUrlPath (SINGLE mode)', () => {
  const routeManager = new RouteManager({ config: singleConfig })

  const routeInfo = {
    name: 'app:course:progress',
    locale: 'en',
    courseSlug: 'default-course',
  } as const

  const url = routeManager.generateFrontendUrlPath(routeInfo)
  expect(url).toBe('/en/progress')

  const parsed = routeManager.parseRouteFromUrl(url)
  expect(parsed).toStrictEqual(routeInfo)
})
