import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'
import initI18n from '@innodoc/shared-core/i18n'
import { RouteManager } from '@innodoc/shared-core/routes'
import type {
  CoursePageRouteInfo,
  CourseSchema,
  LanguageCode,
  PageSchema,
  QuerySectionSchema,
} from '@innodoc/shared-core/types'
import makeStore from '@innodoc/shared-store/ssr'
import render from './entry-server.js'
import { populateStoreForSSR } from './populate-store.js'

const COURSE_SLUG = 'test-course'
const EN_CONTENT = '# Home\n\nEnglish content.'

// The same document shape the built app serves: an empty body, the head filled by unhead
const TEMPLATE = '<!doctype html><html lang="en"><head></head><body></body></html>'

const localesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'locales')

async function loadUiBundle(locale: 'de' | 'en'): Promise<Record<string, unknown>> {
  return JSON.parse(await readFile(path.join(localesDir, locale, 'common.json'), 'utf8')) as Record<string, unknown>
}

// The UI bundles the server renders with, exactly as the i18n plugin loads them from disk
const resources = {
  de: { common: await loadUiBundle('de') },
  en: { common: await loadUiBundle('en') },
}

function makeI18n(lng: 'de' | 'en') {
  return initI18n([], {
    lng,
    supportedLngs: ['de', 'en'],
    ns: 'common',
    defaultNS: 'common',
    resources,
  })
}

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

const missingSectionId: number | undefined = undefined
const missingSectionContent: string | undefined = undefined

/** The page content exists only in `en`: `de` is a declared locale without a content row */
const database: TestDatabase = {
  getCourse: () => Promise.resolve(makeCourse()),
  getCoursePages: () => Promise.resolve([makePage()]),
  getPageContent: (_courseSlug, locale) => Promise.resolve(locale === 'en' ? EN_CONTENT : undefined),
  getCourseSections: () => Promise.resolve([]),
  getSectionIdByPath: () => Promise.resolve(missingSectionId),
  getSectionContent: () => Promise.resolve(missingSectionContent),
}

const routeManager = new RouteManager({
  config: {
    courseSlugMode: 'SINGLE',
    defaultCourseSlug: COURSE_SLUG,
    pagePathPrefix: 'page',
    sectionPathPrefix: 'section',
  },
})

async function renderCoursePage(
  locale: 'de' | 'en',
  i18n: Awaited<ReturnType<typeof makeI18n>>,
): Promise<{ status: number; html: string }> {
  const store = makeStore()
  const routeInfo: CoursePageRouteInfo = {
    courseSlug: COURSE_SLUG,
    locale,
    name: 'app:course:page',
    pageSlug: 'home',
  }

  const populateResult = await populateStoreForSSR({
    store,
    routeInfo,
    locale,
    routeManager,
    database,
    url: `/${locale}/page/home`,
  })
  if (!populateResult.success) {
    throw new Error(`Store population failed: ${JSON.stringify(populateResult)}`)
  }

  const { status, stream } = render({
    htmlTemplate: TEMPLATE,
    i18n,
    locale,
    routeManager,
    store,
    url: `/${locale}/page/home`,
  })
  const statusCode = await status
  const html = await new Promise<string>((resolve, reject) => {
    let out = ''
    stream.on('data', (chunk: Buffer) => {
      out += chunk.toString()
    })
    stream.on('end', () => {
      resolve(out)
    })
    stream.on('error', reject)
  })

  return { status: statusCode, html }
}

// A course that declares the URL locale must serve a document for it, even when the content row
// is missing: the URL is promised via hreflang, so the missing translation is a rendered state,
// not an error. The message is the localized UI string, and the document keeps the URL language
// in `<html lang>` - the T2 machinery is untouched.
test('a declared locale without content renders 200 with the localized not-yet-translated state', async () => {
  const { status, html } = await renderCoursePage('de', await makeI18n('de'))

  expect(status).toBe(200)
  expect(html).toContain('lang="de"')
  expect(html).toContain('Dieser Inhalt wurde noch nicht übersetzt.')
  // The normal page shell: the app mounted with its navigation, in the document language
  expect(html).toContain('id="root"')
  expect(html).toContain('Navigation öffnen')
  // And not the fallback the client would take for a real failure
  expect(html).not.toContain('404 Page Not Found')
})

test('a locale with content renders the content, not the not-yet-translated state', async () => {
  const { status, html } = await renderCoursePage('en', await makeI18n('en'))

  expect(status).toBe(200)
  expect(html).toContain('lang="en"')
  expect(html).toContain('English content.')
  expect(html).not.toContain('not yet translated')
})
