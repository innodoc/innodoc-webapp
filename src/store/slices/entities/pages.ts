import type { LanguageCode } from 'iso-639-1'

import getRouteManager from '#routes/getRouteManager'
import contentApi from '#store/slices/contentApi'
import type { ApiCourse } from '#types/entities/course'
import type { ApiPage } from '#types/entities/page'

import type { CourseIdQueryArg } from './courses'

const routeManager = getRouteManager()

export const pages = contentApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Fetch course pages */
    getCoursePages: builder.query<ApiPage[], CourseIdQueryArg>({
      query: (args) => routeManager.generate('api:course:pages', args),
    }),

    /** Fetch content for a page */
    getPageContent: builder.query<string, PageContentFetchArgs>({
      query: (args) => ({
        responseHandler: 'text',
        url: routeManager.generate('api:course:page:content', args),
      }),
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
