import { RenderErrorPage } from 'vite-plugin-ssr'

import { onBeforeRender as onBeforeRenderDefault } from '@/renderer/_default.page.server'
import { PageContextServer } from '@/types/page'

function onBeforeRender(pageContext: PageContextServer) {
  // 404 if pageId wasn't extracted
  if (pageContext.routeParams.pageId === undefined) {
    throw RenderErrorPage({ pageContext: { is404: true } })
  }

  // Pass pageId to page component
  return onBeforeRenderDefault({
    ...pageContext,
    pageProps: { pageId: pageContext.routeParams.pageId },
  })
}

export { onBeforeRender }
