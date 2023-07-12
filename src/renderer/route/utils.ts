import type { PageContextServer } from '#types/pageContext'
import { isLanguageCode } from '#types/typeGuards'
import { isSlug } from '#utils/content'

type PageContextServerRouting = Pick<
  PageContextServer,
  'needRedirect' | 'routeInfo' | 'urlOriginal'
>

/** Extract locale from URL path */
export function extractLocale(pageContext: PageContextServerRouting) {
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
export function extractCourseSlugFromDomain(pageContext: PageContextServerRouting, host: string) {
  const domainParts = host.split('.')
  if (domainParts.length > 2 && isSlug(domainParts[0])) {
    pageContext.routeInfo.courseSlug = domainParts[0]
  } else {
    pageContext.needRedirect = true
  }
}

/** Extract course slug from URL path */
export function extractCourseSlugFromUrl(pageContext: PageContextServerRouting) {
  const [, urlLocale, urlCourseSlug, ...urlParts] = pageContext.urlOriginal.split('/')
  if (urlCourseSlug && isSlug(urlCourseSlug)) {
    pageContext.urlOriginal = `/${urlLocale}/${urlParts.join('/')}`
    pageContext.routeInfo.courseSlug = urlCourseSlug
  } else {
    pageContext.needRedirect = true
  }
}
