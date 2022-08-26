import type { PageContextServer } from '@/types/page'
import extractLocale from '@/utils/extractLocale'

// Extract locale on client-side navigation
function onBeforeRoute({ locale, urlOriginal }: PageContextServer): {
  pageContext: Partial<PageContextServer>
} {
  if (locale === undefined) {
    const locales = import.meta.env.INNODOC_LOCALES
    const { urlWithoutLocale, locale: extractedLocale } = extractLocale(urlOriginal, locales)
    locale = extractedLocale
    urlOriginal = urlWithoutLocale
  }

  return {
    pageContext: {
      locale,
      urlOriginal,
    },
  }
}

export { onBeforeRoute }
