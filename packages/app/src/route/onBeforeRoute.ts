import { redirect, render } from 'vike/abort'
import type { OnBeforeRouteSync } from 'vike/types'

import { DEFAULT_ROUTE_NAME } from '@innodoc/constants'
import { isLanguageCode } from '@innodoc/utils/typeGuards'
import type { AppRouteInfo } from '@innodoc/routes/types'

import { ExtractionError } from './errors'
import { extractCourseSlugFromDomain, extractCourseSlugFromUrl, extractLocale } from './extractInfo'

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
  const { host, requestLocale } = pageContext

  const routeInfo: AppRouteInfo = {
    courseSlug: import.meta.env.INNODOC_DEFAULT_COURSE_SLUG,
    name: DEFAULT_ROUTE_NAME,
    locale: 'en',
  }

  if (isLanguageCode(requestLocale)) {
    routeInfo.locale = requestLocale // fallback to browser locale
  }

  // Extract locale
  try {
    routeInfo.locale = extractLocale(pageContext.urlOriginal)
  } catch (err) {
    if (err instanceof ExtractionError) {
      // Redirect to URL prefixed with locale
      // TODO: use RouteManager?
      let url = `/${routeInfo.locale}${pageContext.urlOriginal}`
      if (url.endsWith('/')) {
        url = url.slice(0, -1)
      }
      throw redirect(url)
    } else {
      throw err
    }
  }

  // Extract slug from domain
  if (import.meta.env.INNODOC_COURSE_SLUG_MODE === 'SUBDOMAIN' && host !== undefined) {
    try {
      routeInfo.courseSlug = extractCourseSlugFromDomain(host)
    } catch (err) {
      if (err instanceof ExtractionError) {
        throw render(500, 'Unable to extract course slug from sub-domain.')
      } else {
        throw err
      }
    }
  }

  // Extract slug from url path
  else if (import.meta.env.INNODOC_COURSE_SLUG_MODE === 'URL') {
    try {
      routeInfo.courseSlug = extractCourseSlugFromUrl(pageContext.urlPathname)
    } catch (err) {
      if (err instanceof ExtractionError) {
        throw render(500, 'Unable to extract course slug from URL.')
      } else {
        throw err
      }
    }
  }

  return { pageContext: { routeInfo } }
}

export default onBeforeRoute
