import { DEFAULT_ROUTE_NAME } from '#constants'
import type { RouteInfo } from '#types/common'
import type { PageContextOnBeforeRoute, PageContextUpdate } from '#types/pageContext'

import { extractCourseSlugFromDomain, extractCourseSlugFromUrl, extractLocale } from './utils'

/** Extract locale/course slug (SSR/Browser) */
function onBeforeRouteDefault({
  host,
  requestLocale,
  urlOriginal,
}: PageContextOnBeforeRoute): PageContextUpdate {
  const routeInfo: RouteInfo = {
    courseSlug: import.meta.env.INNODOC_DEFAULT_COURSE_SLUG,
    routeName: DEFAULT_ROUTE_NAME,
    locale: requestLocale, // Index route fallbacks to browser locale
  }

  const pageContext = {
    needRedirect: false,
    routeInfo,
    urlOriginal,
  }

  // Extract locale
  extractLocale(pageContext)

  // Extract slug from domain
  if (import.meta.env.INNODOC_COURSE_SLUG_MODE === 'SUBDOMAIN' && host !== undefined) {
    extractCourseSlugFromDomain(pageContext, host)
  }

  // Extract slug from url path
  else if (import.meta.env.INNODOC_COURSE_SLUG_MODE === 'URL') {
    extractCourseSlugFromUrl(pageContext)
  }

  return { pageContext }
}

export default onBeforeRouteDefault
