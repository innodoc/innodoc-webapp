import type { Locale } from '@/types/common'

const locales = ['en', 'de']
const defaultLocale = locales[0]

/** Split locale from URL, e.g. `/en/about` => `en`, `/about`. */
function extractLocale(url: string): ExtractedLocaleInfo {
  let locale = defaultLocale
  let urlWithoutLocale = url

  const urlPaths = url.split('/')
  if (locales.includes(urlPaths[1])) {
    locale = urlPaths[1]
    urlWithoutLocale = `/${urlPaths.slice(2).join('/')}`
  }

  return { locale, urlWithoutLocale }
}

type ExtractedLocaleInfo = {
  locale: Locale
  urlWithoutLocale: string
}

export { extractLocale }
