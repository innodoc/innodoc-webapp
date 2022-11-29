import type { LanguageCode } from 'iso-639-1'
import type { Root } from 'mdast'

import { API_COURSE_PREFIX } from '#routes'
import contentApi from '#store/slices/contentApi'
import type { FragmentType } from '#types/entities/base'
import type { ApiCourse } from '#types/entities/course'
import { getUrl } from '#utils/url'

export const fragments = contentApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Fetch content AST */
    getFragmentContent: builder.query<Root, ContentFetchArgs>({
      query: (args) => getUrl('api/course/fragment/content', args, `${API_COURSE_PREFIX}`),
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
