import type { ContentWithHash } from '@innodoc/types/common'
import type { ApiCourse, FragmentType } from '@innodoc/types/entities'
import type { LanguageCode } from 'iso-639-1'

import getRouteManager from '@innodoc/routes/vite/getRouteManager'

import contentApi from '#slices/content'

const routeManager = getRouteManager()

export const fragments = contentApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Fetch content */
    getFragmentContent: builder.query<ContentWithHash, FragmentContentFetchArgs>({
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
