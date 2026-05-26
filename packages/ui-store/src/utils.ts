import type { LanguageCode } from 'iso-639-1'
import { use } from 'react'
import { assertNever } from '@innodoc/shared-core/typeguards'
import type { ContentType } from '@innodoc/shared-core/types'
import { RouteManagerContext } from '@innodoc/ui-shared/contexts'
import getPagesApi from '#slices/content/pages'
import getSectionsApi from '#slices/content/sections'
import type { AppDispatch } from '#types'

/** Fetch content */
function fetchContent(
  contentType: ContentType,
  courseSlug: string,
  locale: LanguageCode,
  contentIdValue: string,
  dispatch: AppDispatch,
) {
  const routeManager = use(RouteManagerContext)
  const pages = getPagesApi(routeManager)
  const sections = getSectionsApi(routeManager)

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
