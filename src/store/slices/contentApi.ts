import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { LanguageCode } from 'iso-639-1'
import type { Root } from 'mdast'

import { MAX_KEEP_UNUSED_DATA_FOR_MAX } from '#constants'
import type { ApiCourse, ApiPage, ApiSection, Course, Page } from '#types/api'
import { formatUrl } from '#utils/url'

const contentApi = createApi({
  reducerPath: 'contentApi',

  keepUnusedDataFor: MAX_KEEP_UNUSED_DATA_FOR_MAX,

  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.INNODOC_APP_ROOT}api/course` }),

  endpoints: (builder) => ({
    /** Fetch course info */
    getCourse: builder.query<ApiCourse, ApiCourse['name']>({
      query: (name) => `/${name}`,
    }),

    /** Fetch course pages */
    getCoursePages: builder.query<ApiPage[], ApiCourse['name']>({
      query: (courseName) => `/${courseName}/pages`,
    }),

    /** Fetch content AST */
    getContent: builder.query<Root, ContentFetchArgs>({
      query: ({ locale, path }) => `/${locale}/page/${path}`,
    }),

    /** Fetch content AST for a page */
    getPageContent: builder.query<Root, PageContentFetchArgs>({
      query: ({ courseName, locale, pageName }) => `/${courseName}/${locale}/page/${pageName}`,
    }),

    /** Fetch course sections */
    getCourseSections: builder.query<ApiSection[], ApiCourse['name']>({
      query: (courseName) => `/${courseName}/sections`,
    }),

    /** Fetch content AST for a section */
    getSectionContent: builder.query<Root, SectionContentFetchArgs>({
      query: ({ locale, path }) => formatUrl(`/${path}/content.json`, locale),
    }),
  }),
})

export type ContentFetchArgs = {
  locale: LanguageCode
  path: string
}

export type PageContentFetchArgs = {
  courseName: Course['name']
  locale: LanguageCode
  pageName: Page['name']
}

export type SectionContentFetchArgs = {
  locale: LanguageCode
  path: string
}

export const { useGetContentQuery, useGetPageContentQuery, useGetSectionContentQuery } = contentApi
export default contentApi
