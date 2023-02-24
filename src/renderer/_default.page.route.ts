import { SLUG_RE } from '#constants'
import type { PageContextServer } from '#types/pageContext'
import { extractLocale } from '#utils/url'

const slugRegExp = new RegExp(`^${SLUG_RE}$`)

// Extract locale/course slug (SSR/Browser)
function onBeforeRoute({ requestLocale, host, urlPathname }: PageContextServer): {
  pageContext: Partial<PageContextServer>
} {
  // Default slug
  let courseSlug = import.meta.env.INNODOC_DEFAULT_COURSE_SLUG

  // Extract slug from domain
  if (import.meta.env.INNODOC_COURSE_SLUG_MODE === 'SUBDOMAIN' && host !== undefined) {
    const domainParts = host.split('.')
    if (domainParts.length > 2) courseSlug = domainParts[0]
  }

  // Extract slug from url path
  else if (import.meta.env.INNODOC_COURSE_SLUG_MODE === 'URL') {
    const urlParts = urlPathname.split('/')
    if (urlParts !== undefined && urlParts.length > 0) courseSlug = urlParts[1]
  }

  // Validate slug
  if (!slugRegExp.exec(courseSlug)) courseSlug = import.meta.env.INNODOC_DEFAULT_COURSE_SLUG

  // Determine locale from URL, fallback to browser locale
  const { locale } = extractLocale(urlPathname, requestLocale)

  return { pageContext: { courseSlug, locale } }
}

export { onBeforeRoute }
