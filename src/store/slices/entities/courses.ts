import { API_COURSE_PREFIX } from '#routes'
import contentApi from '#store/slices/contentApi'
import type { ApiCourse } from '#types/entities/course'
import { generateUrl } from '#utils/url'

export const courses = contentApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Fetch course info */
    getCourseByName: builder.query<ApiCourse, CourseNameQueryArg>({
      query: (args) => generateUrl('api/course', args, `${API_COURSE_PREFIX}`),
    }),
  }),
})

export type CourseNameQueryArg = { courseName: ApiCourse['name'] }

export const { useGetCourseByNameQuery } = courses
export default courses
