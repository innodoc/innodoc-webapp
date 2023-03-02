import getRouteManager from '#routes/getRouteManager'
import contentApi from '#store/slices/contentApi'
import type { ApiCourse } from '#types/entities/course'

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
