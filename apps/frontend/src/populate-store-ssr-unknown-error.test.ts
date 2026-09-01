import crc32 from 'crc/crc32'
import { expect, test, vi } from 'vitest'
import { RouteManager } from '@innodoc/shared-core/routes'
import type {
  CoursePageRouteInfo,
  CourseSchema,
  LanguageCode,
  PageSchema,
  QuerySectionSchema,
} from '@innodoc/shared-core/types'
import makeStore from '@innodoc/shared-store/ssr'
import { populateStoreForSSR } from './populate-store.js'

// Force markdownToHast to throw a NON-parser error (synchronously, like the real parse-phase
// throw) so the SSR fallback branch is exercised. This module is mocked only in this file; the
// sibling populate-store-ssr.test.ts uses the real parser for the parse-error path.
vi.mock('@innodoc/content-parser', () => ({
  default: () => {
    throw new Error('simulated non-parse failure')
  },
}))

const COURSE_SLUG = 'test-course'
const LOCALE = 'en' as LanguageCode
const CONTENT = '# Hello\n\nA valid page.'

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

test('a non-parser failure does not throw and stores an honest ssr-sourced error for the hash', async () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(vi.fn())
  try {
    const store = makeStore()
    const database: TestDatabase = {
      getCourse: () => Promise.resolve(makeCourse()),
      getCoursePages: () => Promise.resolve([]),
      getPageContent: () => Promise.resolve(CONTENT),
      getCourseSections: () => Promise.resolve([]),
      getSectionIdByPath: () => Promise.reject(new Error('getSectionIdByPath not stubbed')),
      getSectionContent: () => Promise.reject(new Error('getSectionContent not stubbed')),
    }

    const populateResult = await populateStoreForSSR({
      store,
      routeInfo: pageRoute,
      routeManager,
      database,
      url: '/en/page/home',
    })
    expect(populateResult.success).toBe(true)

    const result = store.getState().hast.content[crc32(CONTENT).toString(16)]
    expect(result?.root).toBeUndefined()
    const error = result?.error
    if (error === undefined) {
      throw new Error(`expected an error hast result, got: ${JSON.stringify(result)}`)
    }
    // An unexpected failure is degraded to a wire-shaped error with an honest SSR source
    // (not the worker's), so it can neither hang nor crash the render.
    expect(error.source).toBe('ssr')
    expect(error.ruleId).toBe('ssr-unknown-error')
    expect(error.reason).toBe('simulated non-parse failure')
    expect(error.line).toBe(0)
    expect(error.column).toBe(0)
    // The non-parser branch is the one that logs; the parser-error branch does not.
    expect(consoleError).toHaveBeenCalled()
  } finally {
    consoleError.mockRestore()
  }
})
