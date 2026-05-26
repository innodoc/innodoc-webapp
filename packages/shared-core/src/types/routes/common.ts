import type { RouteName } from './route-names.js'
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

// Extract specific parameter type expected by generator function
type ParamsForGenerator<R extends RouteName> = RouteParams<R> extends infer P ? (P extends object ? P : never) : never

export type { ApiRouteParams, CourseContentRouteParams, ParamsForGenerator, RouteDef, RouteFuncArgs, RouteParams }
