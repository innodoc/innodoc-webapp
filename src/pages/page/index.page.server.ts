import { onBeforeRender as onBeforeRenderDefault } from '#renderer/_default.page.server'
import fetchContent from '#renderer/fetchContent'
import { getPageIdBySlug } from '#server/database/queries/pages'
import pages from '#store/slices/entities/pages'
import type { PageContextServer } from '#types/pageContext'

// TODO Refactor this into function used by page/section

async function onBeforeRender(pageContext: PageContextServer) {
  const {
    locale,
    routeParams: { pageSlug },
  } = pageContext
  const ctx = await onBeforeRenderDefault(pageContext)
  const {
    pageContext: { courseId, store },
  } = ctx

  // Need to fetch page ID for this slug
  const pageId = await getPageIdBySlug(courseId, pageSlug)

  await fetchContent(store, pages.endpoints.getPageContent.initiate({ courseId, locale, pageId }))

  return {
    ...ctx,
    pageContext: {
      ...ctx.pageContext,
      preloadedState: store.getState(),
    },
  }
}

export { onBeforeRender }
