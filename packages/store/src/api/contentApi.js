import { createSelector } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { HYDRATE } from 'next-redux-wrapper'

export const contentApi = createApi({
  reducerPath: 'contentApi',

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_CONTENT_ROOT,
  }),

  endpoints: (builder) => ({
    getManifest: builder.query({ query: () => 'manifest.json' }),

    getPage: builder.query({
      query: ({ locale, pathname }) => `${locale}/_pages/${pathname}.json`,
    }),

    getSection: builder.query({
      query: ({ locale, pathname }) => `${locale}/${pathname}/content.json`,
    }),
  }),

  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      console.log(`extractRehydrationInfo ${action.type}`)
      console.log('  payload=', action.payload)
      return action.payload[reducerPath]
    }

    return undefined
  },
})

export const selectManifest = createSelector(
  contentApi.endpoints.getManifest.select(),
  (result) => result?.data
)

export const {
  endpoints: { getManifest, getPage, getSection },
  util: { getRunningOperationPromises },
} = contentApi
