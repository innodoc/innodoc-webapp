import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { LanguageCode } from 'iso-639-1'
import type { Root } from 'mdast'

import { MAX_KEEP_UNUSED_DATA_FOR_MAX } from '#constants'
import type { ApiCourse, Page, TransformedCourse } from '#types/api'
import { formatUrl } from '#utils/url'

// /** Add section number and path information recursively */
// const transformSection = (
//   section: ApiSection,
//   parents: TransformedSection['parents'],
//   number: TransformedSection['number']
// ): TransformedSection => ({
//   ...section,
//   number,
//   parents,
//   children: section?.children?.map((child, idx) =>
//     transformSection(child, [...parents, section.id], [...number, idx])
//   ),
// })

// /** Transform API response for `Course` */
// const transformResponseCourse = (response: ApiCourse): TransformedCourse => ({
//   ...response,
//   toc: response?.toc?.map((section, idx) => transformSection(section, [], [idx])),
// })

const contentApi = createApi({
  reducerPath: 'contentApi',

  keepUnusedDataFor: MAX_KEEP_UNUSED_DATA_FOR_MAX,

  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.INNODOC_APP_ROOT}api/course` }),

  endpoints: (builder) => ({
    /** Fetch course from content server */
    getCourse: builder.query<TransformedCourse, ApiCourse['name']>({
      query: (name) => formatUrl(name),
    }),

    /** Fetch content AST */
    getContent: builder.query<Root, ContentFetchArgs>({
      query: ({ locale, path }) => formatUrl(`/_${path}`, locale),
    }),

    /** Fetch content AST for a page */
    getPageContent: builder.query<Root, PageContentFetchArgs>({
      query: ({ locale, id }) => formatUrl(`/page/${id}`, locale),
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
  locale: LanguageCode
  id: Page['id']
}

export type SectionContentFetchArgs = {
  locale: LanguageCode
  path: string
}

export const { useGetContentQuery, useGetPageContentQuery, useGetSectionContentQuery } = contentApi
export default contentApi
