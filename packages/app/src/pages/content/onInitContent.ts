import { render } from 'vike/abort'
import type { PageContextServer } from 'vike/types'

import markdownToHast from '@innodoc/markdown'
import { addHastResult } from '@innodoc/store/slices/hast'
import { fetchContent } from '@innodoc/store/utils'
import { serializeParserError } from '@innodoc/utils/content'
import { isParserError } from '@innodoc/utils/typeGuards'
import type { ContentType } from '@innodoc/types/common'

/**
 * Factory function for `onInit` hook for content pages.
 *
 * Prepare state for one-pass rendering on server.
 *
 * - Read route parameter
 * - Fetch content
 * - Transform Markdown->hast
 *
 * @param contentType content type (`page` or `course`)
 * @returns `onInit` function
 */
function onInitContent(contentType: ContentType) {
  return async ({ routeInfo, store }: PageContextServer): Promise<void> => {
    let stringIdValue
    if (routeInfo.name === 'app:course:page') {
      stringIdValue = routeInfo.pageSlug
    } else if (routeInfo.name === 'app:course:section') {
      stringIdValue = routeInfo.sectionPath
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
      stringIdValue,
      store.dispatch,
    )

    // Fetch error?
    if (error ?? data === undefined) {
      // TODO: differentiate between 404 and fetch error
      throw render(404, `Failed to fetch content for ${contentType} ${stringIdValue}`)
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
