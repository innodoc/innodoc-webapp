import { RenderErrorPage } from 'vite-plugin-ssr/RenderErrorPage'

import markdownToHast from '@innodoc/markdown'
import type { PageContextServer, PageContextUpdate } from '@innodoc/server/types'
import { addHastResult } from '@innodoc/store/slices/hast'
import { fetchContent } from '@innodoc/store/utils'
import type { ContentType } from '@innodoc/types/common'
import { isParserError } from '@innodoc/types/type-guards'
import { getStringIdField, serializeParserError } from '@innodoc/utils/content'

import { onBeforeRender as onBeforeRenderDefault } from '#renderer/server'

/**
 * Factory function for `onBeforeRender` hook for content pages
 *
 * Prepare state for one-pass rendering on server. Read route parameter,
 * fetch content and transform Markdown->hast.
 */
function makeOnBeforeRenderContent(contentType: ContentType) {
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
    try {
      const root = await markdownToHast(content)
      store.dispatch(addHastResult({ hash, root }))
    } catch (error) {
      if (isParserError(error)) {
        store.dispatch(addHastResult({ hash, error: serializeParserError(error) }))
      } else {
        console.error('Received unhandled error from Markdown parser!')
        throw error
      }
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

export default makeOnBeforeRenderContent
