import contentApi from '#store/slices/contentApi'
import type { ApiCourse } from '#types/entities/course'
import { getUrl } from '#utils/url'

export const courses = contentApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Fetch course by ID */
    getCourse: builder.query<ApiCourse, CourseIdQueryArg>({
      query: (args) => getUrl('api:course', args),
    }),
  }),
})

export interface CourseIdQueryArg {
  courseId: ApiCourse['id']
}

export const { useGetCourseQuery } = courses
export default courses
