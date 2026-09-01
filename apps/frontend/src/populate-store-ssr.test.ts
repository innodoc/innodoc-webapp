import crc32 from 'crc/crc32'
import { expect, test } from 'vitest'
import { RouteManager } from '@innodoc/shared-core/routes'
import { isParserError } from '@innodoc/shared-core/typeguards'
import type {
  CoursePageRouteInfo,
  CourseSectionRouteInfo,
  CourseSchema,
  LanguageCode,
  PageSchema,
  ParserError,
  QuerySectionSchema,
} from '@innodoc/shared-core/types'
import makeStore from '@innodoc/shared-store/ssr'
import type { Store } from '@innodoc/shared-store/types'
import { populateStoreForSSR } from './populate-store.js'

const COURSE_SLUG = 'test-course'
const LOCALE = 'en' as LanguageCode

/** An unclosed MDX attribute quote: a genuine parse error, not a hand-made error object. */
const BROKEN_CONTENT = '<Info title="unclosed>'

/** A minimal course that satisfies the DB schema and advertises the `en` locale. */
function makeCourse(): CourseSchema {
  const now = new Date('2024-01-01T00:00:00.000Z')
  return {
    id: 1,
    created_at: now,
    updated_at: now,
    slug: COURSE_SLUG,
    title: { en: 'Test course' },
    short_title: null,
    description: null,
    home_link: 'page/home',
    locales: ['en'],
  }
}

interface TestDatabase {
  getCourse(courseSlug: string): Promise<CourseSchema | undefined>
  getCoursePages(courseSlug: string): Promise<PageSchema[]>
  getPageContent(courseSlug: string, locale: LanguageCode, pageSlug: string): Promise<string | undefined>
  getCourseSections(courseSlug: string): Promise<QuerySectionSchema[]>
  getSectionIdByPath(courseSlug: string, sectionPath: string): Promise<number | undefined>
  getSectionContent(courseSlug: string, locale: LanguageCode, sectionId: number): Promise<string | undefined>
}

function makeDatabase(overrides: Partial<TestDatabase> = {}): TestDatabase {
  // The three content fetchers are only reached on their matching route; each test overrides the
  // one it exercises. Reaching a default is a test bug, so the promise rejects loudly.
  return {
    getCourse: () => Promise.resolve(makeCourse()),
    getCoursePages: () => Promise.resolve([]),
    getCourseSections: () => Promise.resolve([]),
    getPageContent: () => Promise.reject(new Error('getPageContent not stubbed')),
    getSectionIdByPath: () => Promise.reject(new Error('getSectionIdByPath not stubbed')),
    getSectionContent: () => Promise.reject(new Error('getSectionContent not stubbed')),
    ...overrides,
  }
}

const routeManager = new RouteManager({
  config: {
    courseSlugMode: 'SINGLE',
    defaultCourseSlug: COURSE_SLUG,
    pagePathPrefix: 'page',
    sectionPathPrefix: 'section',
  },
})

const pageRoute: CoursePageRouteInfo = {
  courseSlug: COURSE_SLUG,
  locale: LOCALE,
  name: 'app:course:page',
  pageSlug: 'home',
}

const sectionRoute: CourseSectionRouteInfo = {
  courseSlug: COURSE_SLUG,
  locale: LOCALE,
  name: 'app:course:section',
  sectionPath: 'intro',
}

function hashOf(content: string): string {
  return crc32(content).toString(16)
}

/** The hast result stored for a content hash. */
function hastResultFor(store: Store, hash: string) {
  return store.getState().hast.content[hash]
}

/** Narrow a hast result to its error, failing the test if the shape is not a parser error. */
function expectParserError(result: { error?: unknown } | undefined): ParserError {
  if (result?.error === undefined || !isParserError(result.error)) {
    throw new Error(`expected a parser-error hast result, got: ${JSON.stringify(result)}`)
  }
  return result.error
}

test('a page with a parse error does not throw and stores the serialized error for its content hash', async () => {
  const store = makeStore()
  const database = makeDatabase({ getPageContent: () => Promise.resolve(BROKEN_CONTENT) })

  // The whole point of the fix: a single parse error must not escape and fail the render pass.
  const populateResult = await populateStoreForSSR({
    store,
    routeInfo: pageRoute,
    routeManager,
    database,
    url: '/en/page/home',
  })
  expect(populateResult.success).toBe(true)

  const result = hastResultFor(store, hashOf(BROKEN_CONTENT))
  expect(result?.root).toBeUndefined()
  // The stored error satisfies the guard the receiver validates, so the in-app MarkdownParserError
  // renders exactly as it does for the client worker's posted error.
  const error = expectParserError(result)
  expect(error.reason).toContain('Unexpected end of file in attribute value')
  expect(error.ruleId).toBe('unexpected-eof')
  expect(error.source).toBe('micromark-extension-mdx-jsx')
  expect(error.line).toBe(1)
  expect(error.column).toBe(23)
})

test('a course section with a parse error behaves the same way', async () => {
  const store = makeStore()
  const database = makeDatabase({
    getSectionIdByPath: () => Promise.resolve(1),
    getSectionContent: () => Promise.resolve(BROKEN_CONTENT),
  })

  const populateResult = await populateStoreForSSR({
    store,
    routeInfo: sectionRoute,
    routeManager,
    database,
    url: '/en/section/intro',
  })
  expect(populateResult.success).toBe(true)

  const result = hastResultFor(store, hashOf(BROKEN_CONTENT))
  expect(result?.root).toBeUndefined()
  const error = expectParserError(result)
  expect(error.ruleId).toBe('unexpected-eof')
})

test('valid content still stores the parsed root for its content hash', async () => {
  const store = makeStore()
  const validContent = '# Hello\n\nA valid page.'
  const database = makeDatabase({ getPageContent: () => Promise.resolve(validContent) })

  const populateResult = await populateStoreForSSR({
    store,
    routeInfo: pageRoute,
    routeManager,
    database,
    url: '/en/page/home',
  })
  expect(populateResult.success).toBe(true)

  const result = hastResultFor(store, hashOf(validContent))
  expect(result?.error).toBeUndefined()
  expect(result?.root).toBeDefined()
})
