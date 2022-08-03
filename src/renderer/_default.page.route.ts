import { PageContextServer } from '@/types/page'
import { extractLocale } from '@/utils/locales'

function onBeforeRoute(pageContext: PageContextServer) {
  // URL is evaluated on the server only, the client has the hydrated result already
  if (import.meta.env.SSR) {
    const { urlWithoutLocale, locale } = extractLocale(pageContext.url)
    return {
      pageContext: {
        locale,
        // Overwrite original URL
        url: urlWithoutLocale,
      },
    }
  }

  return undefined
}

export { onBeforeRoute }
