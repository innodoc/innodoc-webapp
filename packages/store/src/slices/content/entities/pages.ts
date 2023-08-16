import type { ContentWithHash } from '@innodoc/types/common'
import type { ApiCourse, ApiPage } from '@innodoc/types/entities'
import type { LanguageCode } from 'iso-639-1'

import getRouteManager from '@innodoc/routes/vite/getRouteManager'

import contentApi, { hashContentResponse } from '#slices/content'

import type { CourseQueryArg } from './courses'

const routeManager = getRouteManager()

export const pages = contentApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Fetch course pages */
    getCoursePages: builder.query<ApiPage[], CourseQueryArg>({
      query: (args) => routeManager.generate('api:course:pages', args),
    }),

    /** Fetch content for a page */
    getPageContent: builder.query<ContentWithHash, PageContentFetchArgs>({
      query: (args) => ({
        responseHandler: 'text',
        url: routeManager.generate('api:course:page:content', args),
      }),
      transformResponse: hashContentResponse,
    }),
  }),
})

interface PageContentFetchArgs {
  courseSlug: ApiCourse['slug']
  locale: LanguageCode
  pageSlug: ApiPage['slug']
}

export const { useGetCoursePagesQuery, useGetPageContentQuery } = pages
export default pages
