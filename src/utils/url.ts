import ISO6391, { type LanguageCode } from 'iso-639-1'
import { compile } from 'path-to-regexp'

import routes, { type RoutesDefinition } from '#routes'

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

const compilers = Object.fromEntries(
  Object.entries(routes).map(([name, pattern]) => [
    name,
    compile(pattern, { encode: encodeURIComponent }),
  ])
)

/** Generate route URL path from paramers  */
function generateUrl(
  name: keyof RoutesDefinition,
  params: Record<string, string | number>,
  prefix?: string
) {
  const paramsAsStrings = Object.fromEntries(
    Object.entries(params).map(([key, val]) => [key, val.toString()])
  )
  const url = compilers[name](paramsAsStrings)
  if (prefix !== undefined) {
    return url.replace(new RegExp(`^${prefix.replace('/', '\\/')}`), '')
  }
  return url
}

type ExtractedLocaleInfo = {
  locale: LanguageCode
  urlWithoutLocale: string
}

export { extractLocale, formatUrl, generateUrl }
