import type { RouteManager } from '@innodoc/shared-core/routes'
import type { ApiPage, ApiRouteParams, ContentWithHash } from '@innodoc/shared-core/types'

import contentApi, { hashContentResponse } from '#slices/content'

let pagesApi: ReturnType<typeof makePagesApi> | null = null

function makePagesApi(routeManager: RouteManager) {
  return contentApi.injectEndpoints({
    endpoints: (builder) => ({
      /** Fetch course pages */
      getCoursePages: builder.query<ApiPage[], ApiRouteParams['api:course:pages']>({
        query: (args) => routeManager.generateApiUrlPath('api:course:pages', args),
      }),

      /** Fetch content for a page */
      getPageContent: builder.query<ContentWithHash, ApiRouteParams['api:course:page:content']>({
        query: (args) => ({
          responseHandler: 'text',
          url: routeManager.generateApiUrlPath('api:course:page:content', args),
        }),
        transformResponse: hashContentResponse,
      }),
    }),
  })
}

function getCachedPagesApi(routeManager: RouteManager) {
  pagesApi ??= makePagesApi(routeManager)

  return pagesApi
}

export default getCachedPagesApi
