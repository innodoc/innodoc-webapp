import { createSelector } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import camelcaseKeys from 'camelcase-keys'
import decamelize from 'decamelize'
import type { Tree } from 'pandoc-filter'

import type { Manifest, Page, Section, TransformedManifest, TransformedSection } from '@/types/api'

const REDUCER_PATH = 'contentApi'

/** Add section number and path information recursively */
const transformSection = (
  section: Section,
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
      transformResponse: (response) => {
        const manifest = (
          response !== null && typeof response === 'object'
            ? camelcaseKeys(response, { deep: true, stopPaths: ['boxes', 'indexTerms', 'mathjax'] })
            : {}
        ) as Manifest
        return {
          ...manifest,
          toc: manifest?.toc?.map((section, idx) => transformSection(section, [], [idx])),
        } as TransformedManifest
      },
    }),

    /** Fetch content AST */
    getContent: builder.query<Tree, ContentFetchArgs>({
      query: ({ locale, path }) => `${locale}/_${decamelize(path)}.json`,
    }),

    /** Fetch content AST for a page */
    getPageContent: builder.query<Tree, PageContentFetchArgs>({
      query: ({ locale, id }) => `${locale}/_pages/${id}.json`,
    }),

    /** Fetch content AST for a section */
    getSectionContent: builder.query<Tree, SectionContentFetchArgs>({
      query: ({ locale, path }) => `${locale}/${path}.json`,
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
