import { createSelector } from '@reduxjs/toolkit'
import type { AnyAction, PayloadAction } from '@reduxjs/toolkit'
import type { CombinedState } from '@reduxjs/toolkit/dist/query/core/apiState'
import type { EndpointDefinitions } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { Manifest } from '@innodoc/types'

const REDUCER_PATH = 'contentApi'

// Can't use ReturnType as this would be circular
type ContentApiState = CombinedState<EndpointDefinitions, string, typeof REDUCER_PATH>

type HydrateAction = PayloadAction<{ [REDUCER_PATH]: ContentApiState }>

// function isHydrateAction(action: AnyAction): action is HydrateAction {
//   return action.type === HYDRATE
// }

const contentApi = createApi({
  reducerPath: REDUCER_PATH,

  // Content should never be refetched (use highest possible value)
  // https://github.com/reduxjs/redux-toolkit/issues/2535
  keepUnusedDataFor: Math.floor((2 ** 31 - 1) / 1000),

  // baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.INNODOC_CONTENT_ROOT }),
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8001/' }),

  endpoints: (builder) => ({
    getManifest: builder.query<Manifest, void>({
      query: () => 'manifest.json',
    }),
  }),

  extractRehydrationInfo(action, { reducerPath }) {
    // if (isHydrateAction(action)) {
    //   return action.payload[reducerPath]
    // }

    return undefined
  },
})

export const selectManifest = createSelector(
  contentApi.endpoints.getManifest.select(),
  (result) => result.data
)

export default contentApi
