import { onBeforeRender as onBeforeRenderDefault } from '#renderer/_default.page.server'
import fetchContent from '#renderer/fetchContent'
import { getPageIdBySlug } from '#server/database/queries/pages'
import pages from '#store/slices/entities/pages'
import type { PageContextServer, PrepopFactory } from '#types/pageContext'

async function onBeforeRender(pageContext: PageContextServer) {
  const {
    courseId,
    routeParams: { pageSlug },
  } = pageContext

  // Need to fetch page ID for this slug
  const pageId = await getPageIdBySlug(courseId, pageSlug)

  const pagePrepopFactories: PrepopFactory[] =
    pageId !== undefined
      ? [
          // Fetch page content
          (store, locale) =>
            fetchContent(
              store,
              pages.endpoints.getPageContent.initiate({
                courseId,
                locale,
                pageId,
              })
            ),
        ]
      : []

  return onBeforeRenderDefault({
    ...pageContext,

    // Pass page slug to page component
    pageProps: { pageSlug },

    // Pass custom prepopulation task to onBeforeRender
    pagePrepopFactories,
  })
}

// Generate URLs for prerendering
function prerender() {
  // TODO
  // const store = makeStore()
  // await store.dispatch(contentApi.endpoints.getCourse.initiate())
  // const pages = selectPages(store.getState())
  // return pages.map((page) => getPageUrl(page.id))
  return {}
}

export { onBeforeRender, prerender }
