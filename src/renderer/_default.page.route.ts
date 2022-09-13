import type { PageContextServer } from '@/types/page'
import extractLocale from '@/utils/extractLocale'

// Extract locale on client-side navigation
function onBeforeRoute({ locale, urlOriginal }: PageContextServer): {
  pageContext: Partial<PageContextServer>
} {
  const locales = import.meta.env.INNODOC_LOCALES
  const { urlWithoutLocale, locale: extractedLocale } = extractLocale(urlOriginal, locales, locale)
  locale = extractedLocale

  return {
    pageContext: {
      locale,
      urlOriginal: urlWithoutLocale,
    },
  }
}

export { onBeforeRoute }
