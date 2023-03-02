import type { LanguageCode } from 'iso-639-1'

import getRouteManager from '#routes/getRouteManager'
import contentApi from '#store/slices/contentApi'
import type { FragmentType } from '#types/entities/base'
import type { ApiCourse } from '#types/entities/course'

const routeManager = getRouteManager()

export const fragments = contentApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Fetch content */
    getFragmentContent: builder.query<string, FragmentContentFetchArgs>({
      query: (args) => ({
        responseHandler: 'text',
        url: routeManager.generate('api:course:fragment:content', args),
      }),
    }),
  }),
})

interface FragmentContentFetchArgs {
  courseSlug: ApiCourse['slug']
  locale: LanguageCode
  fragmentType: FragmentType
}

export const { useGetFragmentContentQuery } = fragments
export default fragments
