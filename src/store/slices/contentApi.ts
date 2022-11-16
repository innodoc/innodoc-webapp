import { createSelector } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Tree } from 'pandoc-filter'

import { MAX_KEEP_UNUSED_DATA_FOR_MAX } from '@/constants'
import type {
  ApiManifest,
  ApiSection,
  Page,
  TransformedManifest,
  TransformedSection,
} from '@/types/api'
import { formatUrl } from '@/utils/url'

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
  reducerPath: 'contentApi',

  keepUnusedDataFor: MAX_KEEP_UNUSED_DATA_FOR_MAX,

  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.INNODOC_CONTENT_ROOT }),

  endpoints: (builder) => ({
    /** Fetch manifest from content server */
    getManifest: builder.query<TransformedManifest, void>({
      query: () => 'manifest.json',
      transformResponse: transformResponseManifest,
    }),

    /** Fetch content AST */
    getContent: builder.query<Tree, ContentFetchArgs>({
      query: ({ locale, path }) => formatUrl(`/_${path}.json`, locale),
    }),

    /** Fetch content AST for a page */
    getPageContent: builder.query<Tree, PageContentFetchArgs>({
      query: ({ locale, id }) => formatUrl(`/_pages/${id}.json`, locale),
    }),

    /** Fetch content AST for a section */
    getSectionContent: builder.query<Tree, SectionContentFetchArgs>({
      query: ({ locale, path }) => formatUrl(`/${path}/content.json`, locale),
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
