import { DEFAULT_ROUTE_NAME } from '#constants'
import type { RouteInfo } from '#types/common'
import type {
  PageContextOnBeforeRoute,
  PageContextServer,
  PageContextUpdate,
} from '#types/pageContext'
import { isLanguageCode } from '#types/typeGuards'
import { isSlug } from '#utils/content'

type PageContextServerRouting = Pick<
  PageContextServer,
  'needRedirect' | 'routeInfo' | 'urlOriginal'
>

/** Extract locale from URL path */
function extractLocale(pageContext: PageContextServerRouting) {
  const urlParts = pageContext.urlOriginal.split('/')
  if (urlParts.length > 1) {
    const urlLocale = urlParts[1]
    if (isLanguageCode(urlLocale)) {
      pageContext.routeInfo.locale = urlLocale
      return
    }
  }

  // Make sure we have a locale-prefixed URL, so route matching works
  pageContext.urlOriginal = `/${pageContext.routeInfo.locale}${urlParts.join('/')}`
  if (pageContext.urlOriginal.endsWith('/')) {
    pageContext.urlOriginal = pageContext.urlOriginal.slice(0, -1)
  }
  pageContext.needRedirect = true
}

/** Extract course slug from domain name */
function extractCourseSlugFromDomain(pageContext: PageContextServerRouting, host: string) {
  const domainParts = host.split('.')
  if (domainParts.length > 2 && isSlug(domainParts[0])) {
    pageContext.routeInfo.courseSlug = domainParts[0]
  } else {
    pageContext.needRedirect = true
  }
}

/** Extract course slug from URL path */
function extractCourseSlugFromUrl(pageContext: PageContextServerRouting) {
  const [, urlLocale, urlCourseSlug, ...urlParts] = pageContext.urlOriginal.split('/')
  if (urlCourseSlug && isSlug(urlCourseSlug)) {
    pageContext.urlOriginal = `/${urlLocale}/${urlParts.join('/')}`
    pageContext.routeInfo.courseSlug = urlCourseSlug
  } else {
    pageContext.needRedirect = true
  }
}

/** Extract locale/course slug (SSR/Browser) */
function onBeforeRoute({
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

export { onBeforeRoute }
