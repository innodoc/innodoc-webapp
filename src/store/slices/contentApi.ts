import { createSelector } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import camelcaseKeys from 'camelcase-keys'

import type { Manifest } from '@/types/api'

const REDUCER_PATH = 'contentApi'

const contentApi = createApi({
  reducerPath: REDUCER_PATH,

  // Content should never be refetched (use highest possible value)
  // https://github.com/reduxjs/redux-toolkit/issues/2535
  keepUnusedDataFor: Math.floor((2 ** 31 - 1) / 1000),

  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.INNODOC_CONTENT_ROOT }),

  endpoints: (builder) => ({
    getManifest: builder.query<Manifest, void>({
      query: () => 'manifest.json',
      transformResponse: (response) =>
        (response !== null && typeof response === 'object'
          ? camelcaseKeys(response, { deep: true, stopPaths: ['boxes', 'indexTerms', 'mathjax'] })
          : {}) as Manifest,
    }),
  }),
})

export const selectManifest = createSelector(
  contentApi.endpoints.getManifest.select(),
  (result) => result.data
)

export default contentApi
