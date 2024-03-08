import isLocale from 'validator/lib/isLocale'
import { redirect } from 'vike/abort'
import type { LanguageCode } from 'iso-639-1'
import type { OnBeforeRouteSync } from 'vike/types'

import { DEFAULT_ROUTE_NAME } from '@innodoc/constants'
import type { AppRouteInfo } from '@innodoc/routes/types/routeInfos'

import { ExtractionError } from './errors'
import { extractLocale } from './extractInfo'

interface OnBeforeRouteReturnType {
  pageContext: { routeInfo: AppRouteInfo }
}

/**
 * Prepare app routing.
 *
 * - Create initial {@link AppRouteInfo} object.
 * - Extract locale and course slug.
 *
 * Context: browser/server
 *
 * @param pageContext current page context
 * @returns updated page context
 **/
const onBeforeRoute: OnBeforeRouteSync = function (pageContext): OnBeforeRouteReturnType {
  const { requestLocales } = pageContext

  let routeInfo: AppRouteInfo = {
    // courseSlug: import.meta.env.INNODOC_DEFAULT_COURSE_SLUG,
    name: DEFAULT_ROUTE_NAME,
    locale: 'en',
  }

  if (isLocale(pageContext.requestLocales[0])) {
    routeInfo.locale = requestLocales[0] as LanguageCode // fallback to browser locale
  }

  // Extract locale
  try {
    routeInfo.locale = extractLocale(pageContext.urlOriginal)
  } catch (error) {
    if (error instanceof ExtractionError) {
      // Redirect to URL prefixed with locale
      // TODO: use RouteManager?
      let url = `/${routeInfo.locale}${pageContext.urlOriginal}`
      if (url.endsWith('/')) {
        url = url.slice(0, -1)
      }
      throw redirect(url)
    } else {
      throw error
    }
  }

  // TODO: slug domain mode
  // Extract slug from domain
  // if (import.meta.env.INNODOC_COURSE_SLUG_MODE === 'SUBDOMAIN' && host !== undefined) {
  //   try {
  //     routeInfo.courseSlug = extractCourseSlugFromDomain(host)
  //   } catch (err) {
  //     if (err instanceof ExtractionError) {
  //       throw render(500, 'Unable to extract course slug from sub-domain.')
  //     } else {
  //       throw err
  //     }
  //   }
  // }

  return { pageContext: { routeInfo } }
}

export default onBeforeRoute
