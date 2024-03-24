import type RouteManager from '#routeManager'
import type { ApiRouteParams, CourseContentRouteParams, RouteParams } from '#routes'

import type { RouteName } from './routeNames.js'

interface RouteFuncArgs {
  pagePathPrefix: string
  sectionPathPrefix: string
}

type RouteFunc = (args: RouteFuncArgs) => string

type RouteDef = string | RouteFunc

// Extract specific parameter type expected by generator function
type ParamsForGenerator<R extends RouteName> = RouteParams<R> extends infer P ? (P extends object ? P : never) : never

export type {
  ApiRouteParams,
  CourseContentRouteParams,
  ParamsForGenerator,
  RouteDef,
  RouteFuncArgs,
  RouteManager,
  RouteParams,
}
