import { PageContextServer } from '@/types/page'
import { extractLocale } from '@/utils/locales'

const isBrowser = typeof window !== 'undefined'

function onBeforeRoute(pageContext: PageContextServer) {
  // URL is evaluated on server, the client has the extracted locale already
  if (!isBrowser) {
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
