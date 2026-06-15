import type { ApiRouteParams } from '#routes/api-routes'
import type { CourseContentRouteParams } from '#routes/course-routes'

type CombinedRouteParams = ApiRouteParams & CourseContentRouteParams
type RouteParams<R> = R extends keyof CombinedRouteParams ? CombinedRouteParams[R] : Record<string, string>

interface RouteFuncArgs {
  pagePathPrefix: string
  sectionPathPrefix: string
}

type RouteFunc = (args: RouteFuncArgs) => string

type RouteDef = string | RouteFunc

export type { ApiRouteParams, CourseContentRouteParams, RouteDef, RouteFuncArgs, RouteParams }
