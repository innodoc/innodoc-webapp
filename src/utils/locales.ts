import type { Locale } from '@/types/common'

/** Split locale from URL, e.g. `/en/about` => `en`, `/about`. */
function extractLocale(url: string): ExtractedLocaleInfo {
  const urlPaths = url.split('/')
  const locale = urlPaths[1]
  const urlWithoutLocale = `/${urlPaths.slice(2).join('/')}`
  return { locale, urlWithoutLocale }
}

type ExtractedLocaleInfo = {
  locale: Locale
  urlWithoutLocale: string
}

export { extractLocale }
