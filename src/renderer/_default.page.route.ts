import type { PageContextServer } from '#types/pageContext'
import { extractLocale } from '#utils/url'

// Extract locale on client-side navigation
function onBeforeRoute({ locale, urlOriginal }: PageContextServer): {
  pageContext: Partial<PageContextServer>
} {
  const { urlWithoutLocale, locale: extractedLocale } = extractLocale(urlOriginal, locale)
  locale = extractedLocale

  return {
    pageContext: {
      locale,
      urlOriginal: urlWithoutLocale,
    },
  }
}

export { onBeforeRoute }
