import { render } from 'vike/abort'
import type { PageContextServer } from 'vike/types'

import markdownToHast from '@innodoc/content-parser'
import { serializeParserError } from '@innodoc/content-parser/utils'
import { addHastResult } from '@innodoc/ui-store/slices/hast'
import { fetchContent } from '@innodoc/ui-store/utils'
import { isParserError } from '@innodoc/shared-core/typeguards/errors'
import type { ContentType } from '@innodoc/shared-core/types'

/**
 * Factory function for `onInit` hook for content pages.
 *
 * Prepare state for one-pass rendering on server.
 *
 * - Read route parameter
 * - Fetch content
 * - Transform Markdown->hast
 *
 * Context: server
 *
 * @param contentType content type (`page` or `course`)
 * @returns `onInit` function
 */
function onInitContent(contentType: ContentType) {
  return async ({ isClientSideNavigation, routeInfo, store }: PageContextServer): Promise<void> => {
    if (isClientSideNavigation) {
      return
    }

    let contentIdValue
    if (routeInfo.name === 'app:course:page') {
      contentIdValue = routeInfo.pageSlug
    } else if (routeInfo.name === 'app:course:section') {
      contentIdValue = routeInfo.sectionPath
    } else {
      throw new Error('Invalid routeInfo received')
    }

    if (!routeInfo.courseSlug) {
      throw render(500, 'courseSlug is undefined')
    }

    // Fetch content
    const { data, error } = await fetchContent(
      contentType,
      routeInfo.courseSlug,
      routeInfo.locale,
      contentIdValue,
      store.dispatch,
    )

    // Fetch error?
    if (error ?? data === undefined) {
      // TODO: differentiate between 404 and fetch error
      throw render(404, `Failed to fetch content for ${contentType} ${contentIdValue}`)
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
        throw error
      }
    }
  }
}

export default onInitContent
