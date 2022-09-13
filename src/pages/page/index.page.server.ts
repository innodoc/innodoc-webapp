import { onBeforeRender as onBeforeRenderDefault } from '@/renderer/_default.page.server'
import { fetchManifest, fetchPageContent } from '@/renderer/fetchData'
import makeStore from '@/store/makeStore'
import { selectPages } from '@/store/selectors/content/page'
import type { PageContextServer } from '@/types/page'
import { pageUrl } from '@/utils/content'

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

// Generate URLs for prerendering
async function prerender() {
  const store = makeStore()
  await store.dispatch(fetchManifest())
  const pages = selectPages(store.getState())
  return pages.map((page) => pageUrl(page.id))
}

export { onBeforeRender, prerender }
