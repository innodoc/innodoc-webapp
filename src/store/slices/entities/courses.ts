import getRouteManager from '#routes/getRouteManager'
import contentApi from '#store/slices/contentApi'
import type { ApiCourse } from '#types/entities/course'

const routeManager = getRouteManager()

export const courses = contentApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Fetch course by ID */
    getCourse: builder.query<ApiCourse, CourseIdQueryArg>({
      query: (args) => routeManager.generate('api:course', args),
    }),
  }),
})

export interface CourseIdQueryArg {
  courseId: ApiCourse['id']
}

export const { useGetCourseQuery } = courses
export default courses
