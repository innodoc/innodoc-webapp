import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { parse as parseSvg, type RootNode } from 'svg-parser'

import { MAX_KEEP_UNUSED_DATA_FOR_MAX } from '@/constants'

/** Cache SVG content images */
const staticCache = createApi({
  reducerPath: 'staticCache',

  keepUnusedDataFor: MAX_KEEP_UNUSED_DATA_FOR_MAX,

  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.INNODOC_STATIC_ROOT }),

  endpoints: (builder) => ({
    /** Fetch SVG and parse into HAST */
    getSvg: builder.query<RootNode, SvgFetchArgs>({
      query: ({ id }) => ({
        url: `/${id}`,
        responseHandler: 'text',
      }),
      transformResponse: parseSvg,
    }),
  }),
})

type SvgFetchArgs = {
  id: string
}

export const { useGetSvgQuery } = staticCache
export default staticCache
