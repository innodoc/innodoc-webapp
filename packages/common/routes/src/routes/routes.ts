import apiRoutes from './apiRoutes.js'
import builtinRoutes from './builtinRoutes.js'
import courseRoutes, { courseContentRoutes } from './courseRoutes.js'
import userRoutes from './userRoutes.js'
import type { ApiRouteParams } from './apiRoutes.js'
import type { CourseContentRouteParams } from './courseRoutes.js'

type CombinedRouteParams = ApiRouteParams & CourseContentRouteParams
type RouteParams<R> = R extends keyof CombinedRouteParams ? CombinedRouteParams[R] : Record<string, never>

export type { ApiRouteParams, CourseContentRouteParams, RouteParams }
export { apiRoutes, builtinRoutes, courseContentRoutes, courseRoutes, userRoutes }
