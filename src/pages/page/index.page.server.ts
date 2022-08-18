import { onBeforeRender as onBeforeRenderDefault } from '@/renderer/_default.page.server'
import { fetchPageContent } from '@/renderer/fetchData'
import type { PageContextServer } from '@/types/page'

async function onBeforeRender(pageContext: PageContextServer) {
  const { pageId } = pageContext.routeParams

  return onBeforeRenderDefault({
    ...pageContext,

    // Pass pageId to page component
    pageProps: { pageId },

    // Pass custom query to onBeforeRender
    pageQueryFactories: [(locale) => fetchPageContent({ locale, id: pageId })],
  })
}

export { onBeforeRender }
