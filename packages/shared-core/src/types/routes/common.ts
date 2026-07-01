// oxlint-disable-next-line unicorn/prefer-export-from -- used locally and re-exported
import type { ApiRouteParams } from '#routes/api-routes'
// oxlint-disable-next-line unicorn/prefer-export-from -- used locally and re-exported
import type { CourseContentRouteParams } from '#routes/course-routes'

type CombinedRouteParams = ApiRouteParams & CourseContentRouteParams
type RouteParams<R> = R extends keyof CombinedRouteParams ? CombinedRouteParams[R] : Record<string, string>

interface RouteFuncArgs {
  pagePathPrefix: string
  sectionPathPrefix: string
}

type RouteFunc = (args: RouteFuncArgs) => string

type RouteDef = string | RouteFunc

export type { RouteDef, RouteFuncArgs, RouteParams }
export type { ApiRouteParams, CourseContentRouteParams }
