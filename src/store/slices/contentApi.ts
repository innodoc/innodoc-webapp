import { createSelector } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Tree } from 'pandoc-filter'

import type {
  ApiManifest,
  ApiSection,
  Page,
  TransformedManifest,
  TransformedSection,
} from '@/types/api'

const REDUCER_PATH = 'contentApi'

/** Add section number and path information recursively */
const transformSection = (
  section: ApiSection,
  parents: TransformedSection['parents'],
  number: TransformedSection['number']
): TransformedSection => ({
  ...section,
  number,
  parents,
  children: section?.children?.map((child, idx) =>
    transformSection(child, [...parents, section.id], [...number, idx])
  ),
})

/** Transform API response for `Manifest` */
const transformResponseManifest = (response: ApiManifest): TransformedManifest => ({
  ...response,
  toc: response?.toc?.map((section, idx) => transformSection(section, [], [idx])),
})

const contentApi = createApi({
  reducerPath: REDUCER_PATH,

  // Content should never be refetched (use highest possible value)
  // https://github.com/reduxjs/redux-toolkit/issues/2535
  keepUnusedDataFor: Math.floor((2 ** 31 - 1) / 1000),

  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.INNODOC_CONTENT_ROOT }),

  endpoints: (builder) => ({
    /** Fetch manifest from content server */
    getManifest: builder.query<TransformedManifest, void>({
      query: () => 'manifest.json',
      transformResponse: transformResponseManifest,
    }),

    /** Fetch content AST */
    getContent: builder.query<Tree, ContentFetchArgs>({
      query: ({ locale, path }) => `${locale}/_${path}.json`,
    }),

    /** Fetch content AST for a page */
    getPageContent: builder.query<Tree, PageContentFetchArgs>({
      query: ({ locale, id }) => `${locale}/_pages/${id}.json`,
    }),

    /** Fetch content AST for a section */
    getSectionContent: builder.query<Tree, SectionContentFetchArgs>({
      query: ({ locale, path }) => `${locale}/${path}/content.json`,
    }),
  }),
})

export type ContentFetchArgs = {
  locale: string
  path: string
}

export type PageContentFetchArgs = {
  locale: string
  id: Page['id']
}

export type SectionContentFetchArgs = {
  locale: string
  path: string
}

export const selectManifest = createSelector(
  contentApi.endpoints.getManifest.select(),
  (result) => result.data
)

export const { useGetContentQuery, useGetPageContentQuery, useGetSectionContentQuery } = contentApi
export default contentApi
