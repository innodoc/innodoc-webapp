import { onBeforeRender as onBeforeRenderDefault } from '#renderer/_default.page.server'
import fetchContent from '#renderer/fetchContent'
import pages from '#store/slices/entities/pages'
import type { PageContextServer } from '#types/pageContext'

async function onBeforeRender(pageContext: PageContextServer) {
  const { pageSlug } = pageContext.routeParams

  return onBeforeRenderDefault({
    ...pageContext,

    // Pass page slug to page component
    pageProps: { pageSlug },

    // Pass custom prepopulation task to onBeforeRender
    pagePrepopFactories: [
      (store, locale) =>
        fetchContent(
          store,
          pages.endpoints.getPageContent.initiate({
            courseId: pageContext.courseId,
            locale,
            pageSlug,
          })
        ),
    ],
  })
}

// Generate URLs for prerendering
function prerender() {
  // const store = makeStore()
  // await store.dispatch(contentApi.endpoints.getCourse.initiate())
  // const pages = selectPages(store.getState())
  // return pages.map((page) => getPageUrl(page.id))
  return {}
}

export { onBeforeRender, prerender }
