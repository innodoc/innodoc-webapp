import { RenderErrorPage } from 'vite-plugin-ssr/RenderErrorPage'

import { onBeforeRender as onBeforeRenderDefault } from '#renderer/_default.page.server'
import pages from '#store/slices/entities/pages'
import sections from '#store/slices/entities/sections'
import type { ContentType } from '#types/common'
import type { PageContextServer, PageContextUpdate } from '#types/pageContext'
import { getStringIdField } from '#utils/content'

/**
 * Factory function for `onBeforeRender` hook for content pages
 *
 * Reads route parameter, fetches content ID and content.
 */
function makeOnBeforeRender(contentType: ContentType) {
  return async (pageContextInput: PageContextServer): Promise<PageContextUpdate> => {
    const stringIdField = getStringIdField(contentType)

    // Call default onBeforeRender
    const { pageContext } = await onBeforeRenderDefault(pageContextInput)
    const { routeInfo, store } = pageContext
    const stringIdValue = routeInfo?.[stringIdField]

    if (stringIdValue === undefined) {
      throw RenderErrorPage({
        pageContext: { errorMsg: `routeInfo.${stringIdField} is undefined` },
      })
    }
    if (!pageContext.routeInfo?.courseSlug) {
      throw RenderErrorPage({ pageContext: { errorMsg: 'courseSlug is undefined' } })
    }
    if (pageContext?.routeInfo?.locale === undefined) {
      throw RenderErrorPage({ pageContext: { errorMsg: 'locale is undefined' } })
    }
    if (store === undefined) {
      throw RenderErrorPage({ pageContext: { errorMsg: 'store is undefined' } })
    }

    // Fetch content
    const fetchArgs = {
      courseSlug: pageContext.routeInfo.courseSlug,
      locale: pageContext.routeInfo.locale,
    }
    const { error } = await (contentType === 'page'
      ? store.dispatch(
          pages.endpoints.getPageContent.initiate({ ...fetchArgs, pageSlug: stringIdValue })
        )
      : store.dispatch(
          sections.endpoints.getSectionContent.initiate({
            ...fetchArgs,
            sectionPath: stringIdValue,
          })
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
