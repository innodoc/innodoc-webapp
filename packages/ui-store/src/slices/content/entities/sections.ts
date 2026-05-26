import type { RouteManager } from '@innodoc/shared-core/routes'
import type { ApiRouteParams, ApiSection, ContentWithHash } from '@innodoc/shared-core/types'
import contentApi, { hashContentResponse } from '#slices/content'

let sectionsApi: ReturnType<typeof makeSectionsApi> | null = null

function makeSectionsApi(routeManager: RouteManager) {
  return contentApi.injectEndpoints({
    endpoints: (builder) => ({
      /** Fetch course sections */
      getCourseSections: builder.query<ApiSection[], ApiRouteParams['api:course:sections']>({
        query: (args) => routeManager.generateApiUrlPath('api:course:sections', args),
      }),

      /** Fetch content for a section */
      getSectionContent: builder.query<ContentWithHash, ApiRouteParams['api:course:section:content']>({
        query: (args) => ({
          responseHandler: 'text',
          url: routeManager.generateApiUrlPath('api:course:section:content', args),
        }),
        transformResponse: hashContentResponse,
      }),
    }),
  })
}

function getCachedSectionsApi(routeManager: RouteManager) {
  sectionsApi ??= makeSectionsApi(routeManager)

  return sectionsApi
}

// type UseGetCourseSectionsQuery = TypedUseQuery<ApiSection[], ApiRouteParams['api:course:sections'], BaseQuery>
// const useGetCourseSectionsQuery = sections.useGetCourseSectionsQuery as UseGetCourseSectionsQuery

// type UseGetSectionContentQuery = TypedUseQuery<ContentWithHash, ApiRouteParams['api:course:section:content'], BaseQuery>
// const useGetSectionContentQuery = sections.useGetSectionContentQuery as UseGetSectionContentQuery

export default getCachedSectionsApi
