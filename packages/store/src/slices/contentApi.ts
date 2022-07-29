import { createSelector } from '@reduxjs/toolkit'
import type { AnyAction, PayloadAction } from '@reduxjs/toolkit'
import type { CombinedState } from '@reduxjs/toolkit/dist/query/core/apiState'
import type { EndpointDefinitions } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { HYDRATE } from 'next-redux-wrapper'

import type { Manifest } from '@innodoc/types'

const REDUCER_PATH = 'contentApi'

// Can't use ReturnType as this would be circular
type ContentApiState = CombinedState<EndpointDefinitions, string, typeof REDUCER_PATH>

type HydrateAction = PayloadAction<{ [REDUCER_PATH]: ContentApiState }>

function isHydrateAction(action: AnyAction): action is HydrateAction {
  return action.type === HYDRATE
}

const contentApi = createApi({
  reducerPath: REDUCER_PATH,

  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_CONTENT_ROOT }),

  endpoints: (builder) => ({
    getManifest: builder.query<Manifest, void>({
      query: () => 'manifest.json',
    }),
  }),

  extractRehydrationInfo(action, { reducerPath }) {
    if (isHydrateAction(action)) {
      return action.payload[reducerPath]
    }

    return undefined
  },
})

export const selectManifest = createSelector(
  contentApi.endpoints.getManifest.select(),
  (result) => result.data
)

export default contentApi
