import type { LanguageCode } from 'iso-639-1'

import getRouteManager from '#routes/getRouteManager'
import contentApi from '#store/slices/contentApi'
import type { ApiCourse } from '#types/entities/course'
import type { ApiSection } from '#types/entities/section'

import type { CourseQueryArg } from './courses'

const routeManager = getRouteManager()

export const sections = contentApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Fetch course sections */
    getCourseSections: builder.query<ApiSection[], CourseQueryArg>({
      query: (args) => {
        return routeManager.generate('api:course:sections', args)
      },
    }),

    /** Fetch content for a section */
    getSectionContent: builder.query<string, SectionContentFetchArgs>({
      query: (args) => ({
        responseHandler: 'text',
        url: routeManager.generate('api:course:section:content', args),
      }),
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
