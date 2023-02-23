import ISO6391, { type LanguageCode } from 'iso-639-1'
import { compile } from 'path-to-regexp'

import routes, { type RouteName } from '#routes'
import type { TranslatedPage } from '#types/entities/page'

/** Split locale from URL, e.g. `/en/about` => `en`, `/about`. */
function extractLocale(url: string, defaultLocale?: LanguageCode): ExtractedLocaleInfo {
  // Prefer default locale, fallback to English
  let locale = defaultLocale === undefined ? 'en' : defaultLocale
  let urlWithoutLocale = url

  const urlPaths = url.split('/')
  const urlPathLocale = urlPaths[1] as LanguageCode
  if (ISO6391.getAllCodes().includes(urlPathLocale)) {
    locale = urlPathLocale
    urlWithoutLocale = `/${urlPaths.slice(2).join('/')}`
  }

  return { locale, urlWithoutLocale }
}

/** Format URL using locale, hash and base URL */
function formatUrl(to: string, locale?: LanguageCode, hash?: string, base = '/') {
  const href = `${base}${locale ?? ''}${to}`
  return hash ? `${href}#${hash}` : href
}

/** URL compilers for all routes */
const compilers = Object.fromEntries(
  Object.entries(routes).map(([name, pattern]) => [
    name,
    compile(pattern, { encode: encodeURIComponent }),
  ])
)

/** Generate route URL path from paramers */
function getUrl<Args extends object>(name: RouteName, params: Args) {
  // Convert number values to string
  const paramsAsStrings = Object.fromEntries(
    Object.entries(params).map(([key, val]) => [
      key,
      typeof val === 'number' ? val.toString() : val,
    ])
  )

  // Params to route url
  return compilers[name](paramsAsStrings)
}

/** Generate page URL */
function getPageUrl(pageSlug: TranslatedPage['slug']) {
  return `/${import.meta.env.INNODOC_PAGE_PATH_PREFIX}/${pageSlug}`
}

/** Generate section URL */
function getSectionUrl(sectionPath: string) {
  return `/${import.meta.env.INNODOC_SECTION_PATH_PREFIX}/${sectionPath}`
}

/** Replace generic with custom path prefixes */
function replacePathPrefixes(url: string) {
  return url
    .replace('/page/', `/${import.meta.env.INNODOC_PAGE_PATH_PREFIX}/`)
    .replace('/section/', `/${import.meta.env.INNODOC_SECTION_PATH_PREFIX}/`)
}

/** Locale info extracted from URL */
interface ExtractedLocaleInfo {
  locale: LanguageCode
  urlWithoutLocale: string
}

export { extractLocale, formatUrl, getUrl, getPageUrl, getSectionUrl, replacePathPrefixes }
