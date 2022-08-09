import type { Locale } from '@/types/common'

/** Split locale from URL, e.g. `/en/about` => `en`, `/about`. */
function extractLocale(url: string, allowedLocales: readonly Locale[]): ExtractedLocaleInfo {
  let locale = allowedLocales[0]
  let urlWithoutLocale = url

  const urlPaths = url.split('/')
  if (allowedLocales.includes(urlPaths[1])) {
    locale = urlPaths[1]
    urlWithoutLocale = `/${urlPaths.slice(2).join('/')}`
  }

  return { locale, urlWithoutLocale }
}

type ExtractedLocaleInfo = {
  locale: Locale
  urlWithoutLocale: string
}

export default extractLocale
