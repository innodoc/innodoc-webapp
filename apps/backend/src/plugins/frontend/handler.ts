import type { RouteHandlerMethod } from 'fastify'
import type { RenderFunction } from '@innodoc/frontend'
import { populateStoreForSSR } from '@innodoc/frontend/populate-store'
import type Database from '@innodoc/server-db'
import { DEFAULT_LOCALES } from '@innodoc/shared-core/constants'
import type { RouteManager } from '@innodoc/shared-core/routes'
import { localeSchema } from '@innodoc/shared-core/schemas'
import type { ConfigSchema, LanguageCode } from '@innodoc/shared-core/types'

/**
 * Convert a detected language tag to a locale code, falling back to the default
 * locale if the detected value is not a valid locale.
 *
 * @param detected - Detected language (i18next `resolvedLanguage`)
 * @returns Locale code
 */
function resolveLocale(detected: string | undefined): LanguageCode {
  if (detected !== undefined && localeSchema.safeParse(detected).success) {
    return detected as LanguageCode
  }

  return DEFAULT_LOCALES[0] ?? 'en'
}

/**
 * Generate the redirect target for the root path (`/`, no locale in the URL).
 *
 * In URL mode (multi-course) the target is the index page; in SINGLE/SUBDOMAIN
 * mode it is the home page of the default course (from the course `homeLink`).
 *
 * @param options - Options object
 * @param options.database - Database instance
 * @param options.config - Application config
 * @param options.routeManager - Route manager instance
 * @param options.locale - Locale code
 * @returns Redirect target URL path
 */
async function makeRootRedirectTarget({
  database,
  config,
  routeManager,
  locale,
}: {
  database: Database
  config: ConfigSchema
  routeManager: RouteManager
  locale: LanguageCode
}): Promise<string> {
  if (config.courseSlugMode === 'URL') {
    return routeManager.generateFrontendUrlPath({ name: 'app:index', locale })
  }

  if (config.defaultCourseSlug) {
    const course = await database.getCourse(config.defaultCourseSlug)
    if (course) {
      const homeUrl = routeManager.resolveHomeLinkUrl(course.home_link, {
        locale,
        courseSlug: config.defaultCourseSlug,
      })
      if (homeUrl) {
        return homeUrl
      }
    }
  }

  // Fallback: no default course or unresolvable home link - show the index page
  return routeManager.generateFrontendUrlPath({ name: 'app:index', locale })
}

/**
 * Create the SSR route handler.
 *
 * @param render - SSR render function (from frontend server entry)
 * @param htmlTemplate - HTML template
 */
function makeFrontendHandler(render: RenderFunction, htmlTemplate: string): RouteHandlerMethod {
  return async ({ diScope, i18n, url }, reply) => {
    const routeManager: RouteManager = diScope.resolve('routeManager')
    const store = diScope.resolve('store')
    const database: Database = diScope.resolve('database')
    const config: ConfigSchema = diScope.resolve('config')

    // Route patterns only match the path - drop the query string if present
    const [path = '/'] = url.split('?')

    // Root path has no locale - redirect to a locale-prefixed target
    if (path === '/' || path === '') {
      const locale = resolveLocale(i18n.resolvedLanguage)
      const target = await makeRootRedirectTarget({ database, config, routeManager, locale })
      reply.status(302).redirect(target)
      return
    }

    // Parse URL to extract route info
    const routeInfo = routeManager.parseRouteFromUrl(path)

    if (!routeInfo) {
      // No matching route - return 404
      reply.status(404).type('text/html')
      reply.send('<h1>404 - Not Found</h1>')
      return
    }

    // Populate store with data for this route (using direct DB calls)
    const populateResult = await populateStoreForSSR({
      store,
      routeInfo,
      routeManager,
      database,
      url: path,
    })

    // Handle redirect
    if (populateResult.redirect) {
      reply.status(populateResult.redirect.statusCode)
      reply.redirect(populateResult.redirect.url)
      return
    }

    // Handle error
    if (!populateResult.success) {
      reply.status(404).type('text/html')
      const message = populateResult.error?.message ?? 'Not found'
      reply.send(`<h1>404 - ${message}</h1>`)
      return
    }

    // Render with populated store
    const stream = render({ htmlTemplate, i18n, routeManager, store, url })
    reply.type('text/html')
    reply.send(stream)
  }
}

export default makeFrontendHandler
