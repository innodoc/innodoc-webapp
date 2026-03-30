import type { RouteManager } from '@innodoc/shared-core/routes'
import type { ApiCourse, ApiRouteParams } from '@innodoc/shared-core/types'

import contentApi from '#slices/content'

let coursesApi: ReturnType<typeof makeCoursesApi> | null = null

function makeCoursesApi(routeManager: RouteManager) {
  return contentApi.injectEndpoints({
    endpoints: (builder) => ({
      /** Fetch course */
      getCourse: builder.query<ApiCourse, ApiRouteParams['api:course']>({
        query: (args) => routeManager.generateApiUrlPath('api:course', args),
      }),
    }),
  })
}

function getCachedCoursesApi(routeManager: RouteManager) {
  coursesApi ??= makeCoursesApi(routeManager)

  return coursesApi
}

export default getCachedCoursesApi
