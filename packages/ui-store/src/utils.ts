import type { LanguageCode } from 'iso-639-1'

import { assertNever } from '@innodoc/shared-core/typeguards'
import type { ContentType } from '@innodoc/shared-core/types'

import pages from '#slices/content/pages'
import sections from '#slices/content/sections'
import type { AppDispatch } from '#types'

/** Fetch content */
function fetchContent(
  contentType: ContentType,
  courseSlug: string,
  locale: LanguageCode,
  contentIdValue: string,
  dispatch: AppDispatch,
) {
  switch (contentType) {
    case 'page': {
      return dispatch(
        pages.endpoints.getPageContent.initiate({
          courseSlug,
          locale,
          pageSlug: contentIdValue,
        }),
      )
    }

    case 'section': {
      return dispatch(
        sections.endpoints.getSectionContent.initiate({
          courseSlug,
          locale,
          sectionPath: contentIdValue,
        }),
      )
    }

    default: {
      assertNever(contentType)
    }
  }
}

export { fetchContent }
