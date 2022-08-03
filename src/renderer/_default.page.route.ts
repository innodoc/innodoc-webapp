import { PageContextServer } from '@/types/page'
import { extractLocale } from '@/utils/locales'

// Save extracted locale in pageContext (client and server)
function onBeforeRoute(pageContext: PageContextServer) {
  const { urlWithoutLocale, locale } = extractLocale(pageContext.url)

  return {
    pageContext: {
      locale,
      // Overwrite original URL
      url: urlWithoutLocale,
    },
  }
}

export { onBeforeRoute }
