// TODO: how to handle SVG with mdast?

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { parse as parseSvg, type RootNode } from 'svg-parser'

import { MAX_KEEP_UNUSED_DATA_FOR_MAX } from '#constants'

/** Cache SVG content images */
const staticCache = createApi({
  reducerPath: 'staticCache',

  keepUnusedDataFor: MAX_KEEP_UNUSED_DATA_FOR_MAX,

  baseQuery: fetchBaseQuery({ baseUrl: 'TODO' }), // TODO

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

interface SvgFetchArgs {
  id: string
}

export const { useGetSvgQuery } = staticCache
export default staticCache
