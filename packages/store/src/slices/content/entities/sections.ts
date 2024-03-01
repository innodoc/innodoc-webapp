import type { LanguageCode } from 'iso-639-1'

import getRouteManager from '@innodoc/routes/vite/getRouteManager'
import type { ContentWithHash } from '@innodoc/types/common'
import type { ApiCourse, ApiSection } from '@innodoc/types/entities'

import contentApi, { hashContentResponse } from '#slices/content'

import type { CourseQueryArg } from './courses'

const routeManager = getRouteManager()

export const sections = contentApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Fetch course sections */
    getCourseSections: builder.query<ApiSection[], CourseQueryArg>({
      query: (args) => routeManager.generate('api:course:sections', args),
    }),

    /** Fetch content for a section */
    getSectionContent: builder.query<ContentWithHash, SectionContentFetchArgs>({
      query: (args) => ({
        responseHandler: 'text',
        url: routeManager.generate('api:course:section:content', args),
      }),
      transformResponse: hashContentResponse,
    }),
  }),
})

interface SectionContentFetchArgs {
  courseSlug: ApiCourse['slug']
  locale: LanguageCode
  sectionPath: ApiSection['path']
}

export const { useGetCourseSectionsQuery, useGetSectionContentQuery } = sections
export default sections
