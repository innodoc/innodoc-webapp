import type { TypedUseQuery } from '@reduxjs/toolkit/query/react'

import getRouteManager from '@innodoc/routes/vite/getRouteManager'
import type { ApiRouteParams } from '@innodoc/routes/types'
import type { ApiPage } from '@innodoc/schema/types'
import type { ContentWithHash } from '@innodoc/types/common'

import contentApi, { hashContentResponse } from '#slices/content'
import type { BaseQuery } from '#types'

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

type UseGetCoursePagesQuery = TypedUseQuery<ApiPage[], ApiRouteParams['api:course:pages'], BaseQuery>
const useGetCoursePagesQuery = pages.useGetCoursePagesQuery as UseGetCoursePagesQuery

type UseGetPageContentQuery = TypedUseQuery<ContentWithHash, ApiRouteParams['api:course:page:content'], BaseQuery>
const useGetPageContentQuery = pages.useGetPageContentQuery as UseGetPageContentQuery

export { useGetCoursePagesQuery, useGetPageContentQuery }
export default pages
