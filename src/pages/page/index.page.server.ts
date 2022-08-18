import { onBeforeRender as onBeforeRenderDefault } from '@/renderer/_default.page.server'
import { PageContextServer } from '@/types/page'

function onBeforeRender(pageContext: PageContextServer) {
  // Pass pageId to page component
  return onBeforeRenderDefault({
    ...pageContext,
    pageProps: { pageId: pageContext.routeParams.pageId },
  })
}

export { onBeforeRender }
