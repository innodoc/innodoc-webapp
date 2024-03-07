import apiRoutes from './apiRoutes'
import builtinRoutes from './builtinRoutes'
import courseRoutes, { courseContentRoutes } from './courseRoutes'
import userRoutes from './userRoutes'
import type { ApiRouteParams } from './apiRoutes'
import type { CourseContentRouteParams } from './courseRoutes'

type CombinedRouteParams = ApiRouteParams & CourseContentRouteParams
type RouteParams<R> = R extends keyof CombinedRouteParams
  ? CombinedRouteParams[R]
  : Record<string, never>

export type { ApiRouteParams, CourseContentRouteParams, RouteParams }
export { apiRoutes, builtinRoutes, courseContentRoutes, courseRoutes, userRoutes }
