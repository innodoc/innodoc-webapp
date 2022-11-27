import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { MAX_KEEP_UNUSED_DATA_FOR_MAX } from '#constants'

const contentApi = createApi({
  reducerPath: 'contentApi',
  keepUnusedDataFor: MAX_KEEP_UNUSED_DATA_FOR_MAX,
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.INNODOC_APP_ROOT}api/course` }),
  endpoints: () => ({}),
})

export default contentApi
