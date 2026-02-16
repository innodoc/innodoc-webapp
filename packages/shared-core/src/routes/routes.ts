import apiRoutes from './api-routes.js'
import builtinRoutes from './builtin-routes.js'
import courseRoutes, { courseContentRoutes } from './course-routes.js'
import userRoutes from './user-routes.js'
import type { ApiRouteParams } from './api-routes.js'
import type { CourseContentRouteParams } from './course-routes.js'

type CombinedRouteParams = ApiRouteParams & CourseContentRouteParams
type RouteParams<R> = R extends keyof CombinedRouteParams ? CombinedRouteParams[R] : Record<string, unknown>

export type { ApiRouteParams, CourseContentRouteParams, RouteParams }
export { apiRoutes, builtinRoutes, courseContentRoutes, courseRoutes, userRoutes }
