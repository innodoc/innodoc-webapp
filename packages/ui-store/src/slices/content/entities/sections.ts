import type { TypedUseQuery } from '@reduxjs/toolkit/query/react'

import getRouteManager from '@innodoc/shared-core/routes/manager'
import type { ApiRouteParams } from '@innodoc/shared-core/routes/types'
import type { ApiSection } from '@innodoc/shared-core/schemas/types'
import type { ContentWithHash } from '@innodoc/shared-core/types/common'

import contentApi, { hashContentResponse } from '#slices/content'
import type { BaseQuery } from '#types'

const routeManager = getRouteManager()

const sections = contentApi.injectEndpoints({
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

type UseGetCourseSectionsQuery = TypedUseQuery<ApiSection[], ApiRouteParams['api:course:sections'], BaseQuery>
const useGetCourseSectionsQuery = sections.useGetCourseSectionsQuery as UseGetCourseSectionsQuery

type UseGetSectionContentQuery = TypedUseQuery<ContentWithHash, ApiRouteParams['api:course:section:content'], BaseQuery>
const useGetSectionContentQuery = sections.useGetSectionContentQuery as UseGetSectionContentQuery

export { useGetCourseSectionsQuery, useGetSectionContentQuery }
export default sections
