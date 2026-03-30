import type { RouteManager } from '@innodoc/shared-core/routes'
import type { ApiRouteParams, ContentWithHash } from '@innodoc/shared-core/types'

import contentApi from '#slices/content'

let fragmentsApi: ReturnType<typeof makeFragmentsApi> | null = null

function makeFragmentsApi(routeManager: RouteManager) {
  return contentApi.injectEndpoints({
    endpoints: (builder) => ({
      /** Fetch content */
      getFragmentContent: builder.query<ContentWithHash, ApiRouteParams['api:course:fragment:content']>({
        query: (args) => ({
          responseHandler: 'text',
          url: routeManager.generateApiUrlPath('api:course:fragment:content', args),
        }),
      }),
    }),
  })
}

function getCachedFragmentsApi(routeManager: RouteManager) {
  fragmentsApi ??= makeFragmentsApi(routeManager)

  return fragmentsApi
}

export default getCachedFragmentsApi
