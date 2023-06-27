import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import crc32 from 'crc/crc32'

import { MAX_KEEP_UNUSED_DATA_FOR_MAX } from '#constants'

function hashContentResponse(content: string) {
  return {
    content,
    hash: crc32(content).toString(16),
  }
}

const contentApi = createApi({
  reducerPath: 'contentApi',
  keepUnusedDataFor: MAX_KEEP_UNUSED_DATA_FOR_MAX,
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.INNODOC_APP_ROOT }),
  endpoints: () => ({}),
})

export { hashContentResponse }
export default contentApi
