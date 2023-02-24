import ISO6391, { type LanguageCode } from 'iso-639-1'

import getRoutes from '#routes/getRoutes'
import type { TranslatedPage } from '#types/entities/page'

/** Locale info extracted from URL */
interface ExtractedLocaleInfo {
  locale: LanguageCode
  urlWithoutLocale: string
}

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
// TODO remove
function formatUrl(to: string, locale?: LanguageCode, hash?: string, base = '/') {
  const href = `${base}${locale ?? ''}${to}`
  return hash ? `${href}#${hash}` : href
}

/** Generate route URL path from paramers */
function getUrl<Args extends object>(name: string, params: Args) {
  const { generateUrl } = getRoutes()

  // Convert number values to string
  const paramsAsStrings = Object.fromEntries(
    Object.entries(params).map(([key, val]) => [
      key,
      typeof val === 'number' ? val.toString() : val,
    ])
  )

  // TODO: add hostname in domain path mode?

  return generateUrl(name, paramsAsStrings)
}

/** Generate page URL */
// TODO remove
function getPageUrl(pageSlug: TranslatedPage['slug']) {
  return `/${import.meta.env.INNODOC_PAGE_PATH_PREFIX}/${pageSlug}`
}

/** Replace generic with custom path prefixes */
// TODO should not be needed anymore
function replacePathPrefixes(url: string) {
  return url
    .replace('/page/', `/${import.meta.env.INNODOC_PAGE_PATH_PREFIX}/`)
    .replace('/section/', `/${import.meta.env.INNODOC_SECTION_PATH_PREFIX}/`)
}

export { extractLocale, formatUrl, getPageUrl, getUrl, replacePathPrefixes }
