import { onBeforeRender as onBeforeRenderDefault } from '@/renderer/_default.page.server'
import { fetchSectionContent } from '@/renderer/fetchData'
import type { PageContextServer } from '@/types/page'

async function onBeforeRender(pageContext: PageContextServer) {
  const { sectionPath } = pageContext.routeParams

  return onBeforeRenderDefault({
    ...pageContext,

    // Pass sectionPath to page component
    pageProps: { sectionPath },

    // Pass custom query to onBeforeRender
    pageQueryFactories: [(locale) => fetchSectionContent({ locale, path: sectionPath })],
  })
}

export { onBeforeRender }
