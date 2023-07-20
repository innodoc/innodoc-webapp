import getRouteManager from '@innodoc/routes/vite/getRouteManager'
import type { ApiCourse } from '@innodoc/types/entities'

import contentApi from '#slices/content'

const routeManager = getRouteManager()

export const courses = contentApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Fetch course */
    getCourse: builder.query<ApiCourse, CourseQueryArg>({
      query: (args) => routeManager.generate('api:course', args),
    }),
  }),
})

export interface CourseQueryArg {
  courseSlug: ApiCourse['slug']
}

export const { useGetCourseQuery } = courses
export default courses
