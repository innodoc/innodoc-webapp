import type { LanguageCode } from 'iso-639-1'

import contentApi from '#store/slices/contentApi'
import type { ApiCourse } from '#types/entities/course'
import type { ApiSection } from '#types/entities/section'
import { getUrl } from '#utils/url'

import type { CourseNameQueryArg } from './courses'

export const sections = contentApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Fetch course sections */
    getCourseSections: builder.query<ApiSection[], CourseNameQueryArg>({
      query: (args) => {
        return getUrl('api/course/sections', args)
      },
    }),

    /** Fetch content for a section */
    getSectionContent: builder.query<string, SectionContentFetchArgs>({
      query: (args) => ({
        responseHandler: 'text',
        url: getUrl('api/course/section/content', args),
      }),
    }),
  }),
})

interface SectionContentFetchArgs {
  courseId: ApiCourse['id']
  locale: LanguageCode
  sectionId: ApiSection['id']
}

export const { useGetCourseSectionsQuery, useGetSectionContentQuery } = sections
export default sections
