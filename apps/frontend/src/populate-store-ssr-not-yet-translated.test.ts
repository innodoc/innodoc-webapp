import { expect, test } from 'vitest'
import { RouteManager } from '@innodoc/shared-core/routes'
import { NOT_YET_TRANSLATED_CONTENT } from '@innodoc/shared-core/sentinels'
import type {
  CoursePageRouteInfo,
  CourseSectionRouteInfo,
  CourseSchema,
  LanguageCode,
  PageSchema,
  QuerySectionSchema,
} from '@innodoc/shared-core/types'
import getPagesApi from '@innodoc/shared-store/slices/content/pages'
import getSectionsApi from '@innodoc/shared-store/slices/content/sections'
import makeStore from '@innodoc/shared-store/ssr'
import { populateStoreForSSR } from './populate-store.js'

const COURSE_SLUG = 'test-course'

/** A course that declares both locales but whose page content exists only in `en` */
function makeCourse(): CourseSchema {
  const now = new Date('2024-01-01T00:00:00.000Z')
  return {
    id: 1,
    created_at: now,
    updated_at: now,
    slug: COURSE_SLUG,
    title: { de: 'Kurs zum Testen', en: 'Course for testing' },
    short_title: null,
    description: null,
    home_link: 'app:course:page|home',
    locales: ['en', 'de'],
  }
}

function makePage(): PageSchema {
  const now = new Date('2024-01-01T00:00:00.000Z')
  return {
    id: 1,
    created_at: now,
    updated_at: now,
    slug: 'home',
    title: { de: 'Home-Seite', en: 'Home page' },
    short_title: null,
    icon: 'mdi:home',
    linked: ['footer', 'nav'],
    course_id: 1,
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
  return {
    getCourse: () => Promise.resolve(makeCourse()),
    getCoursePages: () => Promise.resolve([makePage()]),
    getPageContent: () => Promise.reject(new Error('getPageContent not stubbed')),
    getCourseSections: () => Promise.resolve([]),
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

const dePageRoute: CoursePageRouteInfo = {
  courseSlug: COURSE_SLUG,
  locale: 'de',
  name: 'app:course:page',
  pageSlug: 'home',
}

const enPageRoute: CoursePageRouteInfo = {
  courseSlug: COURSE_SLUG,
  locale: 'en',
  name: 'app:course:page',
  pageSlug: 'home',
}

const deSectionRoute: CourseSectionRouteInfo = {
  courseSlug: COURSE_SLUG,
  locale: 'de',
  name: 'app:course:section',
  sectionPath: 'intro',
}

const missingSectionId: number | undefined = undefined
const missingPageContent: string | undefined = undefined
const missingSectionContent: string | undefined = undefined

/** Read one content query out of the store's RTK Query cache */
function cachedPageContent(store: ReturnType<typeof makeStore>, locale: LanguageCode, pageSlug: string) {
  return getPagesApi(routeManager).endpoints.getPageContent.select({ courseSlug: COURSE_SLUG, locale, pageSlug })(
    store.getState(),
  )
}

function cachedSectionContent(store: ReturnType<typeof makeStore>, locale: LanguageCode, sectionPath: string) {
  return getSectionsApi(routeManager).endpoints.getSectionContent.select({
    courseSlug: COURSE_SLUG,
    locale,
    sectionPath,
  })(store.getState())
}

test('a page without content in a declared locale succeeds with the not-yet-translated sentinel', async () => {
  const store = makeStore()
  const database = makeDatabase({
    // The page exists (it is listed) but has no content row in `de`
    getPageContent: (_courseSlug, locale) =>
      Promise.resolve(locale === 'en' ? '# Home\n\nEnglish content.' : undefined),
  })

  const populateResult = await populateStoreForSSR({
    store,
    routeInfo: dePageRoute,
    locale: 'de',
    routeManager,
    database,
    url: '/de/page/home',
  })

  expect(populateResult.success).toBe(true)
  // The document stays in the URL locale: the sentinel is content for this language, not a fallback
  expect(store.getState().app.routeInfo.locale).toBe('de')
  expect(cachedPageContent(store, 'de', 'home').data).toEqual(NOT_YET_TRANSLATED_CONTENT)
})

test('a page with content in the declared locale is unaffected', async () => {
  const store = makeStore()
  const database = makeDatabase({
    getPageContent: () => Promise.resolve('# Home\n\nEnglish content.'),
  })

  const populateResult = await populateStoreForSSR({
    store,
    routeInfo: enPageRoute,
    locale: 'en',
    routeManager,
    database,
    url: '/en/page/home',
  })

  expect(populateResult.success).toBe(true)
  const data = cachedPageContent(store, 'en', 'home').data
  expect(data).toBeDefined()
  expect(data?.hash).not.toBe(NOT_YET_TRANSLATED_CONTENT.hash)
})

test('a page the course does not list stays NOT_FOUND', async () => {
  const store = makeStore()
  const database = makeDatabase({
    getPageContent: () => Promise.resolve(missingPageContent),
  })

  const populateResult = await populateStoreForSSR({
    store,
    routeInfo: { ...dePageRoute, pageSlug: 'does-not-exist' },
    locale: 'de',
    routeManager,
    database,
    url: '/de/page/does-not-exist',
  })

  expect(populateResult).toMatchObject({ success: false, error: { type: 'NOT_FOUND' } })
})

test('a section without content in a declared locale succeeds with the not-yet-translated sentinel', async () => {
  const store = makeStore()
  const database = makeDatabase({
    getSectionIdByPath: () => Promise.resolve(1),
    // The section exists (its id resolves) but has no content row in `de`
    getSectionContent: () => Promise.resolve(missingSectionContent),
  })

  const populateResult = await populateStoreForSSR({
    store,
    routeInfo: deSectionRoute,
    locale: 'de',
    routeManager,
    database,
    url: '/de/section/intro',
  })

  expect(populateResult.success).toBe(true)
  expect(cachedSectionContent(store, 'de', 'intro').data).toEqual(NOT_YET_TRANSLATED_CONTENT)
})

test('a section the course does not list stays NOT_FOUND', async () => {
  const store = makeStore()
  const database = makeDatabase({
    getSectionIdByPath: () => Promise.resolve(missingSectionId),
  })

  const populateResult = await populateStoreForSSR({
    store,
    routeInfo: deSectionRoute,
    locale: 'de',
    routeManager,
    database,
    url: '/de/section/intro',
  })

  expect(populateResult).toMatchObject({ success: false, error: { type: 'NOT_FOUND' } })
})
