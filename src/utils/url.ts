import ISO6391, { type LanguageCode } from 'iso-639-1'

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

type ExtractedLocaleInfo = {
  locale: LanguageCode
  urlWithoutLocale: string
}

export { extractLocale, formatUrl }
