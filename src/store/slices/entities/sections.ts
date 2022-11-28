import type { LanguageCode } from 'iso-639-1'
import type { Root } from 'mdast'

import { API_COURSE_PREFIX } from '#routes'
import contentApi from '#store/slices/contentApi'
import type { ApiCourse } from '#types/entities/course'
import type { ApiSection } from '#types/entities/section'
import { generateUrl } from '#utils/url'

import type { CourseNameQueryArg } from './courses'

export const sections = contentApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Fetch course sections */
    getCourseSections: builder.query<ApiSection[], CourseNameQueryArg>({
      query: (args) => {
        return generateUrl('api/course/sections', args, `${API_COURSE_PREFIX}`)
      },
    }),

    /** Fetch content AST for a section */
    getSectionContent: builder.query<Root, SectionContentFetchArgs>({
      query: (args) => generateUrl('api/course/section/content', args, `${API_COURSE_PREFIX}`),
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
