import type { LanguageCode } from 'iso-639-1'

import contentApi from '#store/slices/contentApi'
import type { FragmentType } from '#types/entities/base'
import type { ApiCourse } from '#types/entities/course'
import type { MarkdownDoc } from '#types/entities/markdown'
import { getUrl } from '#utils/url'

export const fragments = contentApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Fetch content AST */
    getFragmentContent: builder.query<MarkdownDoc, ContentFetchArgs>({
      query: (args) => getUrl('api/course/fragment/content', args),
    }),
  }),
})

interface ContentFetchArgs {
  courseId: ApiCourse['id']
  locale: LanguageCode
  fragmentType: FragmentType
}

export const { useGetFragmentContentQuery } = fragments
export default fragments
