import type { TypedUseQuery } from '@reduxjs/toolkit/query/react'

import getRouteManager from '@innodoc/shared-core/routes/manager/vite'
import type { ApiCourse, ApiRouteParams } from '@innodoc/shared-core/types'

import contentApi from '#slices/content'
import type { BaseQuery } from '#types'

const routeManager = getRouteManager()

const courses = contentApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Fetch course */
    getCourse: builder.query<ApiCourse, ApiRouteParams['api:course']>({
      query: (args) => routeManager.generateApiUrlPath('api:course', args),
    }),
  }),
})

type UseGetCourseQuery = TypedUseQuery<ApiCourse, ApiRouteParams['api:course'], BaseQuery>
const useGetCourseQuery = courses.useGetCourseQuery as UseGetCourseQuery

export { useGetCourseQuery }
export default courses
