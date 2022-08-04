import { PageContextServer } from '@/types/page'
import { extractLocale } from '@/utils/locales'

// Extract locale on client-side navigation
function onBeforeRoute(pageContext: PageContextServer) {
  let { locale, url } = pageContext

  if (locale === undefined) {
    const { urlWithoutLocale, locale: extractedLocale } = extractLocale(url)
    locale = extractedLocale
    url = urlWithoutLocale
  }

  return {
    pageContext: {
      locale,
      url,
    },
  }
}

export { onBeforeRoute }
