import type { LanguageCode } from 'iso-639-1'
import type { Root } from 'mdast'

import { API_COURSE_PREFIX } from '#routes'
import contentApi from '#store/slices/contentApi'
import type { ContentFragmentType } from '#types/entities/base'
import type { ApiCourse } from '#types/entities/course'
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
  courseId: ApiCourse['id']
  locale: LanguageCode
  fragmentType: ContentFragmentType
}

export const { useGetContentQuery } = fragments
export default fragments
