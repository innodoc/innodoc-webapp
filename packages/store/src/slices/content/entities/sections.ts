import getRouteManager from '@innodoc/routes/vite/getRouteManager'
import type { ApiRouteParams } from '@innodoc/routes/types'
import type { ContentWithHash } from '@innodoc/types/common'
import type { ApiSection } from '@innodoc/types/entities'

import contentApi, { hashContentResponse } from '#slices/content'

const routeManager = getRouteManager()

const sections = contentApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Fetch course sections */
    getCourseSections: builder.query<ApiSection[], ApiRouteParams['api:course:sections']>({
      query: (args) => routeManager.apiUrl('api:course:sections', args),
    }),

    /** Fetch content for a section */
    getSectionContent: builder.query<ContentWithHash, ApiRouteParams['api:course:section:content']>({
      query: (args) => ({
        responseHandler: 'text',
        url: routeManager.apiUrl('api:course:section:content', args),
      }),
      transformResponse: hashContentResponse,
    }),
  }),
})

export const { useGetCourseSectionsQuery, useGetSectionContentQuery } = sections
export default sections
