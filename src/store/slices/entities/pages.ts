import type { LanguageCode } from 'iso-639-1'

import contentApi from '#store/slices/contentApi'
import type { ApiCourse } from '#types/entities/course'
import type { MarkdownDoc } from '#types/entities/markdown'
import type { ApiPage } from '#types/entities/page'
import { getUrl } from '#utils/url'

import type { CourseNameQueryArg } from './courses'

export const pages = contentApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Fetch course pages */
    getCoursePages: builder.query<ApiPage[], CourseNameQueryArg>({
      query: (args) => getUrl('api/course/pages', args),
    }),

    /** Fetch content AST for a page */
    getPageContent: builder.query<MarkdownDoc, PageContentFetchArgs>({
      query: (args) => getUrl('api/course/page/content', args),
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
