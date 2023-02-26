import { RenderErrorPage } from 'vite-plugin-ssr'

import { onBeforeRender as onBeforeRenderDefault } from '#renderer/_default.page.server'
import { getPageIdBySlug } from '#server/database/queries/pages'
import { getSectionIdByPath } from '#server/database/queries/sections'
import pages from '#store/slices/entities/pages'
import sections from '#store/slices/entities/sections'
import type { PageContextServer, PageContextUpdate } from '#types/pageContext'
import { capitalize } from '#utils/content'

/**
 * Factory function for `onBeforeRender` hook for content pages
 *
 * Reads route parameter, fetches content ID and content.
 */
function makeOnBeforeRender(contentType: 'page' | 'section') {
  return async (pageContextInput: PageContextServer): Promise<PageContextUpdate> => {
    const stringIdField = contentType === 'page' ? 'pageSlug' : 'sectionPath'
    const getContentId = contentType === 'page' ? getPageIdBySlug : getSectionIdByPath

    // Call default onBeforeRender
    const { pageContext } = await onBeforeRenderDefault(pageContextInput)
    const { routeParams, store } = pageContext
    const stringIdValue = routeParams?.[stringIdField]

    if (stringIdValue === undefined)
      throw RenderErrorPage({
        pageContext: { errorMsg: `routeParams.${stringIdField} is undefined` },
      })
    if (pageContext.courseId === undefined)
      throw RenderErrorPage({ pageContext: { errorMsg: 'courseId is undefined' } })
    if (pageContext.locale === undefined)
      throw RenderErrorPage({ pageContext: { errorMsg: 'locale is undefined' } })
    if (store === undefined)
      throw RenderErrorPage({ pageContext: { errorMsg: 'store is undefined' } })

    // Fetch content ID
    const id = await getContentId(pageContext.courseId, stringIdValue)
    if (id === undefined) {
      const errorMsg = `${capitalize(contentType)} ${stringIdValue} not found`
      throw RenderErrorPage({ pageContext: { errorMsg, is404: true } })
    }

    // Fetch content
    const fetchArgs = { courseId: pageContext.courseId, locale: pageContext.locale }
    const { error } = await (contentType === 'page'
      ? store.dispatch(pages.endpoints.getPageContent.initiate({ ...fetchArgs, pageId: id }))
      : store.dispatch(
          sections.endpoints.getSectionContent.initiate({ ...fetchArgs, sectionId: id })
        ))
    if (error) {
      const errorMsg = `Failed to fetch content for ${contentType} ${stringIdValue}`
      throw RenderErrorPage({ pageContext: { errorMsg } })
    }

    // Overwrite context with current preloaded state
    return {
      pageContext: {
        ...pageContext,
        preloadedState: store.getState(),
      },
    }
  }
}

export default makeOnBeforeRender
