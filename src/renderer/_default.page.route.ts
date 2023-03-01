import type { RouteInfo } from '#types/common'
import type { PageContextServer, PageContextUpdate } from '#types/pageContext'
import { isLanguageCode } from '#types/typeGuards'
import { isSlug } from '#utils/content'

// Extract locale/course slug (SSR/Browser)
function onBeforeRoute({ host, requestLocale, urlOriginal }: PageContextServer): PageContextUpdate {
  const routeInfo: Partial<RouteInfo> = {
    courseSlug: import.meta.env.INNODOC_DEFAULT_COURSE_SLUG,
    routeName: 'app:index',
    locale: requestLocale, // Index route fallbacks to browser locale
  }

  const pageContext = {
    routeInfo,
    urlOriginal,
    urlPristine: urlOriginal, // save for matching URLs in route functions
  }

  // Extract locale from URL
  const [, urlLocale, ...urlParts] = urlOriginal.split('/')
  if (isLanguageCode(urlLocale)) {
    // Overwrite URL
    pageContext.urlOriginal = `/${urlParts.join('/')}`
    routeInfo.locale = urlLocale
  } else {
    // Redirect if we don't have proper locale-prefixed url
    // TODO use generateURL??
    const redirectTo = `/${requestLocale}${urlOriginal}`
    return {
      pageContext: { redirectTo: redirectTo.at(-1) === '/' ? redirectTo.slice(0, -1) : redirectTo },
    }
  }

  // Extract slug from domain
  if (import.meta.env.INNODOC_COURSE_SLUG_MODE === 'SUBDOMAIN' && host !== undefined) {
    const domainParts = host.split('.')
    if (domainParts.length > 2 && isSlug(domainParts[0])) {
      routeInfo.courseSlug = domainParts[0]
    }
  }

  // Extract slug from url path
  else if (import.meta.env.INNODOC_COURSE_SLUG_MODE === 'URL') {
    const [, urlCourseSlug, ...urlParts] = urlOriginal.split('/')
    if (urlCourseSlug && isSlug(urlCourseSlug)) {
      pageContext.urlOriginal = `/${urlParts.join('/')}`
      routeInfo.courseSlug = urlCourseSlug
    }
  }

  const pageContextUpdate = { pageContext }

  return pageContextUpdate
}

export { onBeforeRoute }
