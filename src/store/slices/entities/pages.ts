import type { LanguageCode } from 'iso-639-1'
import type { Root } from 'mdast'

import { API_COURSE_PREFIX } from '#routes'
import contentApi from '#store/slices/contentApi'
import type { ApiCourse } from '#types/entities/course'
import type { ApiPage } from '#types/entities/page'
import { generateUrl } from '#utils/url'

import type { CourseNameQueryArg } from './courses'

export const pages = contentApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Fetch course pages */
    getCoursePages: builder.query<ApiPage[], CourseNameQueryArg>({
      query: (args) => generateUrl('api/course/pages', args, `${API_COURSE_PREFIX}`),
    }),

    /** Fetch content AST for a page */
    getPageContent: builder.query<Root, PageContentFetchArgs>({
      query: (args) => generateUrl('api/course/page/content', args, `${API_COURSE_PREFIX}`),
    }),
  }),
})

interface PageContentFetchArgs {
  courseId: ApiCourse['id']
  locale: LanguageCode
  pageId: ApiPage['id']
}

export const { useGetCoursePagesQuery, useGetPageContentQuery } = pages
export default pages
