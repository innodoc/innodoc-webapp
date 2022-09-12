import buildData from '@/__buildData.json'
import type { PageContextServer } from '@/types/page'
import extractLocale from '@/utils/extractLocale'

const { locales } = buildData

// Extract locale on client-side navigation
function onBeforeRoute({ locale, urlOriginal }: PageContextServer): {
  pageContext: Partial<PageContextServer>
} {
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
