import { onBeforeRender as onBeforeRenderDefault } from '#renderer/_default.page.server'
import fetchContent from '#renderer/fetchContent'
import { getSectionIdByPath } from '#server/database/queries/sections'
import sections from '#store/slices/entities/sections'
import type { PageContextServer } from '#types/pageContext'

async function onBeforeRender(pageContext: PageContextServer) {
  const {
    locale,
    routeParams: { sectionPath },
  } = pageContext

  const ctx = await onBeforeRenderDefault(pageContext)
  const {
    pageContext: { courseId, store },
  } = ctx

  // Need to fetch section ID for this path
  const sectionId = await getSectionIdByPath(courseId, sectionPath)

  await fetchContent(
    store,
    sections.endpoints.getSectionContent.initiate({ courseId, locale, sectionId })
  )

  return {
    ...ctx,
    pageContext: {
      ...ctx.pageContext,
      preloadedState: store.getState(),
    },
  }
}

export { onBeforeRender }
