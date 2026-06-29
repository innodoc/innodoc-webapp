import type { LanguageCode } from 'iso-639-1'
import camelcaseKeys from 'camelcase-keys'
import crc32 from 'crc/crc32'
import markdownToHast from '@innodoc/content-parser'
import type { RouteManager } from '@innodoc/shared-core/routes'
import { isCoursePageRouteInfo, isCourseRouteInfo, isCourseSectionRouteInfo } from '@innodoc/shared-core/typeguards'
import type {
  ApiCourse,
  ApiPage,
  ApiSection,
  ContentWithHash,
  CourseSchema,
  FrontendRouteInfo,
  PageSchema,
  QuerySectionSchema,
} from '@innodoc/shared-core/types'
import { changeRouteInfo } from '@innodoc/shared-store/slices/app/app-slice'
import contentApi from '@innodoc/shared-store/slices/content'
import getCachedCoursesApi from '@innodoc/shared-store/slices/content/entities/courses'
import getCachedPagesApi from '@innodoc/shared-store/slices/content/entities/pages'
import getCachedSectionsApi from '@innodoc/shared-store/slices/content/entities/sections'
import { addHastResult } from '@innodoc/shared-store/slices/hast/hast-slice'
import type { Store } from '@innodoc/shared-store/types'

/** Minimal database interface for SSR store population. */
interface SsrDatabase {
  getCourse(courseSlug: string): Promise<CourseSchema | undefined>
  getCoursePages(courseSlug: string): Promise<PageSchema[]>
  getPageContent(courseSlug: string, locale: LanguageCode, pageSlug: string): Promise<string | undefined>
  getCourseSections(courseSlug: string): Promise<QuerySectionSchema[]>
  getSectionIdByPath(courseSlug: string, sectionPath: string): Promise<number | undefined>
  getSectionContent(courseSlug: string, locale: LanguageCode, sectionId: number): Promise<string | undefined>
}

/** Result of store population. */
interface PopulateStoreResult {
  success: boolean
  redirect?: {
    url: string
    statusCode: 301 | 302
  }
  error?: {
    type: 'NOT_FOUND' | 'LOCALE_MISMATCH' | 'API_ERROR'
    message: string
  }
}

/** Hash content string. */
function hashContent(content: string): ContentWithHash {
  return {
    content,
    hash: crc32(content).toString(16),
  }
}

/**
 * Recursively convert all Date objects to ISO strings.
 *
 * The database returns `Date` objects for timestamp columns, but Redux
 * requires all state values to be JSON-serializable. The HTTP API layer
 * handles this automatically via Fastify's JSON serialization — the SSR
 * direct-DB path must do it manually.
 */
function serializeDates<T>(value: T): T {
  if (value instanceof Date) {
    return value.toISOString() as never
  }

  if (Array.isArray(value)) {
    return value.map(serializeDates) as never
  }

  if (value != null && typeof value === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value)) {
      result[key] = serializeDates(val)
    }
    return result as never
  }

  return value
}

/**
 * Populate the Redux store with data for the current route (SSR).
 *
 * Uses direct database calls instead of RTK Query endpoints to avoid
 * self-referential HTTP requests during SSR.
 *
 * This function:
 * 1. Sets the route info
 * 2. Fetches course metadata (for all course routes)
 * 3. Validates locale
 * 4. Fetches pages and sections lists
 * 5. Fetches content (for content routes) and converts to HAST
 *
 * @param options - Options object
 * @param options.store - Redux store
 * @param options.routeInfo - Parsed route info from URL
 * @param options.routeManager - Route manager instance
 * @param options.database - Database instance for direct data access
 * @returns Population result with success/error/redirect info
 */
export async function populateStoreForSSR({
  store,
  routeInfo,
  routeManager,
  database,
}: {
  store: Store
  routeInfo: FrontendRouteInfo
  routeManager: RouteManager
  database: SsrDatabase
}): Promise<PopulateStoreResult> {
  // Step 1: Set route info
  store.dispatch(changeRouteInfo(routeInfo))

  // Step 2: Fetch course metadata (for all course routes)
  if (isCourseRouteInfo(routeInfo)) {
    const course = await database.getCourse(routeInfo.courseSlug)

    if (!course) {
      return {
        success: false,
        error: {
          type: 'NOT_FOUND',
          message: `Course '${routeInfo.courseSlug}' not found`,
        },
      }
    }

    // Convert to API format (camelCase) and upsert into RTK Query cache
    const apiCourse = serializeDates(camelcaseKeys(course)) as ApiCourse
    const coursesApi = getCachedCoursesApi(routeManager)
    void store.dispatch(coursesApi.util.upsertQueryData('getCourse', { courseSlug: routeInfo.courseSlug }, apiCourse))

    // Step 3: Validate locale
    if (!course.locales.includes(routeInfo.locale)) {
      const redirectUrl = routeManager.generateFrontendUrlPath({
        ...routeInfo,
        locale: course.locales[0],
      })

      return {
        success: false,
        redirect: {
          url: redirectUrl,
          statusCode: 302,
        },
      }
    }

    // Step 4: Fetch pages and sections lists
    const [pages, sections] = await Promise.all([
      database.getCoursePages(routeInfo.courseSlug),
      database.getCourseSections(routeInfo.courseSlug),
    ])

    const pagesApi = getCachedPagesApi(routeManager)
    const sectionsApi = getCachedSectionsApi(routeManager)

    // Convert to API format (camelCase) and upsert into RTK Query cache
    const apiPages = pages.map((page) => serializeDates(camelcaseKeys(page)) as ApiPage)
    const apiSections = sections.map((section) => serializeDates(camelcaseKeys(section)) as ApiSection)

    void store.dispatch(pagesApi.util.upsertQueryData('getCoursePages', { courseSlug: routeInfo.courseSlug }, apiPages))
    void store.dispatch(
      sectionsApi.util.upsertQueryData('getCourseSections', { courseSlug: routeInfo.courseSlug }, apiSections),
    )

    // Step 5: Fetch content (for content routes)
    if (isCoursePageRouteInfo(routeInfo)) {
      const content = await database.getPageContent(routeInfo.courseSlug, routeInfo.locale, routeInfo.pageSlug)

      if (!content) {
        return {
          success: false,
          error: {
            type: 'NOT_FOUND',
            message: 'Content not found',
          },
        }
      }

      // Hash content and upsert into RTK Query cache
      const contentWithHash = hashContent(content)
      void store.dispatch(
        pagesApi.util.upsertQueryData(
          'getPageContent',
          { courseSlug: routeInfo.courseSlug, locale: routeInfo.locale, pageSlug: routeInfo.pageSlug },
          contentWithHash,
        ),
      )

      // Convert Markdown to HAST
      const hastRoot = await markdownToHast(content)
      store.dispatch(addHastResult({ hash: contentWithHash.hash, root: hastRoot }))
    } else if (isCourseSectionRouteInfo(routeInfo)) {
      // Get section ID from path
      const sectionId = await database.getSectionIdByPath(routeInfo.courseSlug, routeInfo.sectionPath)

      if (!sectionId) {
        return {
          success: false,
          error: {
            type: 'NOT_FOUND',
            message: 'Section not found',
          },
        }
      }

      const content = await database.getSectionContent(routeInfo.courseSlug, routeInfo.locale, sectionId)

      if (!content) {
        return {
          success: false,
          error: {
            type: 'NOT_FOUND',
            message: 'Content not found',
          },
        }
      }

      // Hash content and upsert into RTK Query cache
      const contentWithHash = hashContent(content)
      void store.dispatch(
        sectionsApi.util.upsertQueryData(
          'getSectionContent',
          { courseSlug: routeInfo.courseSlug, locale: routeInfo.locale, sectionPath: routeInfo.sectionPath },
          contentWithHash,
        ),
      )

      // Convert Markdown to HAST
      const hastRoot = await markdownToHast(content)
      store.dispatch(addHastResult({ hash: contentWithHash.hash, root: hastRoot }))
    }
  }

  return { success: true }
}

// Ensure contentApi is imported so endpoints are registered
void contentApi
