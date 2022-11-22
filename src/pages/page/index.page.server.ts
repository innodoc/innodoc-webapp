import { onBeforeRender as onBeforeRenderDefault } from '#renderer/_default.page.server'
import fetchContent from '#renderer/fetchContent'
import makeStore from '#store/makeStore'
import { selectPages } from '#store/selectors/content/page'
import contentApi from '#store/slices/contentApi'
import type { PageContextServer } from '#types/page'
import { getPageUrl } from '#utils/content'

async function onBeforeRender(pageContext: PageContextServer) {
  const { pageId } = pageContext.routeParams

  return onBeforeRenderDefault({
    ...pageContext,

    // Pass pageId to page component
    pageProps: { pageId },

    // Pass custom prepopulation task to onBeforeRender
    pagePrepopFactories: [
      (store, locale) =>
        fetchContent(store, contentApi.endpoints.getPageContent.initiate({ locale, id: pageId })),
    ],
  })
}

// Generate URLs for prerendering
async function prerender() {
  const store = makeStore()
  await store.dispatch(contentApi.endpoints.getManifest.initiate())
  const pages = selectPages(store.getState())
  return pages.map((page) => getPageUrl(page.id))
}

export { onBeforeRender, prerender }
