import type { PageContextServer } from '@/types/page'
import extractLocale from '@/utils/extractLocale'

// Extract locale on client-side navigation
function onBeforeRoute({ locale, url }: PageContextServer): {
  pageContext: Partial<PageContextServer>
} {
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
