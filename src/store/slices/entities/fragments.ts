import type { LanguageCode } from 'iso-639-1'
import type { Root } from 'mdast'

import { API_COURSE_PREFIX } from '#routes'
import contentApi from '#store/slices/contentApi'
import { generateUrl } from '#utils/url'

export const fragments = contentApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Fetch content AST */
    getContent: builder.query<Root, ContentFetchArgs>({
      query: (args) => generateUrl('api/course/fragment/content', args, `${API_COURSE_PREFIX}`),
    }),
  }),
})

type ContentFetchArgs = {
  locale: LanguageCode
  path: string
}

export const { useGetContentQuery } = fragments
export default fragments
