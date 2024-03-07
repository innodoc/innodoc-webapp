import getRouteManager from '@innodoc/routes/vite/getRouteManager'
import type { ApiRouteParams } from '@innodoc/routes/types'
import type { ApiCourse } from '@innodoc/types/entities'

import contentApi from '#slices/content'

const routeManager = getRouteManager()

const courses = contentApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Fetch course */
    getCourse: builder.query<ApiCourse, ApiRouteParams['api:course']>({
      query: (args) => routeManager.apiUrl('api:course', args),
    }),
  }),
})

export const { useGetCourseQuery } = courses
export default courses
