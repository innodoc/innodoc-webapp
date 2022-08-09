import { PageContextServer } from '@/types/page'
import extractLocale from '@/utils/extractLocale'

// Extract locale on client-side navigation
function onBeforeRoute(pageContext: PageContextServer) {
  let { locale, url } = pageContext

  if (locale === undefined) {
    const locales = import.meta.env.INNODOC_LOCALES

    const { urlWithoutLocale, locale: extractedLocale } = extractLocale(url, locales)
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
