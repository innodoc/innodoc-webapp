import getRouteManager from '@innodoc/routes/vite/getRouteManager'
import type { ApiRouteParams } from '@innodoc/routes/types'
import type { ContentWithHash } from '@innodoc/types/common'
import type { ApiPage } from '@innodoc/types/entities'

import contentApi, { hashContentResponse } from '#slices/content'

const routeManager = getRouteManager()

const pages = contentApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Fetch course pages */
    getCoursePages: builder.query<ApiPage[], ApiRouteParams['api:course:pages']>({
      query: (args) => routeManager.apiUrl('api:course:pages', args),
    }),

    /** Fetch content for a page */
    getPageContent: builder.query<ContentWithHash, ApiRouteParams['api:course:page:content']>({
      query: (args) => ({
        responseHandler: 'text',
        url: routeManager.apiUrl('api:course:page:content', args),
      }),
      transformResponse: hashContentResponse,
    }),
  }),
})

export const { useGetCoursePagesQuery, useGetPageContentQuery } = pages
export default pages
