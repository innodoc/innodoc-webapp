import type { TypedUseQuery } from '@reduxjs/toolkit/query/react'

import getRouteManager from '@innodoc/routes/vite/getRouteManager'
import type { ApiRouteParams } from '@innodoc/routes/types'
import type { ContentWithHash } from '@innodoc/types/common'

import contentApi from '#slices/content'
import type { BaseQuery } from '#types'

const routeManager = getRouteManager()

const fragments = contentApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Fetch content */
    getFragmentContent: builder.query<ContentWithHash, ApiRouteParams['api:course:fragment:content']>({
      query: (args) => ({
        responseHandler: 'text',
        url: routeManager.apiUrl('api:course:fragment:content', args),
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
