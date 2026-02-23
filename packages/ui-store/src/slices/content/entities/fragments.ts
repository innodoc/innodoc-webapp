import type { TypedUseQuery } from '@reduxjs/toolkit/query/react'

import getRouteManager from '@innodoc/shared-core/routes/manager/vite'
import type { ApiRouteParams, ContentWithHash } from '@innodoc/shared-core/types'

import contentApi from '#slices/content'
import type { BaseQuery } from '#types'

const routeManager = getRouteManager()

const fragments = contentApi.injectEndpoints({
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

type UseGetFragmentContentQuery = TypedUseQuery<
  ContentWithHash,
  ApiRouteParams['api:course:fragment:content'],
  BaseQuery
>
const useGetFragmentContentQuery = fragments.useGetFragmentContentQuery as UseGetFragmentContentQuery

export { useGetFragmentContentQuery }
export default fragments
