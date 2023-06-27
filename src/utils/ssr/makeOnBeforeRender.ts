import { RenderErrorPage } from 'vite-plugin-ssr/RenderErrorPage'

import markdownToHast from '#markdown/markdownToHast/markdownToHast'
import { onBeforeRender as onBeforeRenderDefault } from '#renderer/_default.page.server'
import { addHastRoot } from '#store/slices/hastSlice'
import type { ContentType } from '#types/common'
import type { PageContextServer, PageContextUpdate } from '#types/pageContext'
import { getStringIdField } from '#utils/content'
import fetchContent from '#utils/fetchContent'

/**
 * Factory function for `onBeforeRender` hook for content pages
 *
 * Prepare state for one-pass rendering on server. Read route parameter,
 * fetch content and transform Markdown->hast.
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
    const { data, error } = await fetchContent(
      contentType,
      pageContext.routeInfo.courseSlug,
      pageContext.routeInfo.locale,
      stringIdValue,
      store.dispatch
    )

    // Fetch error?
    if (error || data === undefined) {
      const errorMsg = `Failed to fetch content for ${contentType} ${stringIdValue}`
      throw RenderErrorPage({ pageContext: { errorMsg } })
    }

    // Transform Markdown->hast
    const { content, hash } = data
    const root = await markdownToHast(content)
    store.dispatch(addHastRoot({ hash, root }))

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
