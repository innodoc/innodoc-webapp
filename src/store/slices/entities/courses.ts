import { API_COURSE_PREFIX } from '#routes'
import contentApi from '#store/slices/contentApi'
import type { ApiCourse } from '#types/entities/course'
import { generateUrl } from '#utils/url'

export const courses = contentApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Fetch course info */
    getCourse: builder.query<ApiCourse, CourseNameQueryArg>({
      query: (args) => generateUrl('api/course', args, `${API_COURSE_PREFIX}`),
    }),
  }),
})

export type CourseNameQueryArg = {
  courseId: ApiCourse['id']
}

export const { useGetCourseQuery } = courses
export default courses
