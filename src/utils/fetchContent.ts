import type { LanguageCode } from 'iso-639-1'

import type { AppDispatch } from '#store/makeStore'
import pages from '#store/slices/entities/pages'
import sections from '#store/slices/entities/sections'
import type { ContentType } from '#types/common'

/** Fetch content */
function fetchContent(
  contentType: ContentType,
  courseSlug: string,
  locale: LanguageCode,
  stringIdValue: string,
  dispatch: AppDispatch
) {
  if (contentType === 'page') {
    return dispatch(
      pages.endpoints.getPageContent.initiate({
        courseSlug,
        locale,
        pageSlug: stringIdValue,
      })
    )
  }

  // section
  return dispatch(
    sections.endpoints.getSectionContent.initiate({
      courseSlug,
      locale,
      sectionPath: stringIdValue,
    })
  )
}

export default fetchContent
