import { compile, match } from 'path-to-regexp'
import type { Match, MatchFunction, PathFunction } from 'path-to-regexp'

import { API_COURSE_PREFIX, API_PREFIX } from '@innodoc/constants'
import { isContentType } from '@innodoc/typeguards/content'
import type { CourseSlugMode } from '@innodoc/types/common'

import { apiRoutes, builtinRoutes, courseRoutes, userRoutes } from './routes/routes'
import { isAppRouteInfo, isAppRouteName, isCourseContentRouteName } from './typeGuards'
import type { ApiRouteParams } from './routes/routes'
import type { ParamsForGenerator, RouteDef, RouteFuncArgs, RouteParams } from './types/common'
import type { CourseContentRouteInfo } from './types/routeInfos'
import type { ApiRouteName, AppRouteName, RouteName } from './types/routeNames'

type PathFunctions = {
  [key in RouteName]: PathFunction<RouteParams<key>>
}
type Matchers = {
  [key in RouteName]: MatchFunction<RouteParams<key>>
}

class RouteManager {
  private static instance: RouteManager | null

  private readonly routes = {
    ...apiRoutes,
    ...builtinRoutes,
    ...courseRoutes,
    ...userRoutes,
  }

  private readonly courseSlugMode: CourseSlugMode

  private routeFuncArgs: RouteFuncArgs

  private pathFunctions: PathFunctions

  private matchers: Matchers

  private readonly parseOptions = {
    sensitive: true,
    strict: true,
  }

  private constructor(courseSlugMode: CourseSlugMode, pagePathPrefix: string, sectionPathPrefix: string) {
    this.courseSlugMode = courseSlugMode
    this.routeFuncArgs = { pagePathPrefix, sectionPathPrefix }
    const { pathFunctions, matchers } = this.buildRoutes()
    this.pathFunctions = pathFunctions
    this.matchers = matchers
  }

  /** Get singleton */
  public static getInstance(
    courseSlugMode: CourseSlugMode,
    pagePathPrefix: string,
    sectionPathPrefix: string,
  ): RouteManager {
    if (!RouteManager.instance) {
      RouteManager.instance = new RouteManager(courseSlugMode, pagePathPrefix, sectionPathPrefix)
    }

    return RouteManager.instance
  }

  /**
   * Generate app URL path from route name and parameters.
   *
   * @param routeInfo route info object
   * @returns URL
   */
  public appUrl(routeInfo: Record<string, unknown>): string {
    if (isAppRouteInfo(routeInfo)) {
      const { name, ...params } = routeInfo
      return this.pathFunctions[name](params as ParamsForGenerator<typeof name>)
    }
    throw new TypeError('Unable to parse routeInfo object')
  }

  /**
   * Generate API URL path from route name and parameters.
   *
   * @param routeInfo route info object
   * @returns URL
   */
  public apiUrl<R extends ApiRouteName>(name: R, params: ApiRouteParams[R]): string {
    return this.pathFunctions[name](params as ParamsForGenerator<R>)
  }

  /**
   *
   * Parse link specifier.
   *
   * Link specifiers take the form `ROUTE_NAME|ROUTE_PARAMS` (e.g.
   * `app:section:page|about`).
   *
   * @params specifier Link specifier
   * @returns `AppRouteInfo` object
   */
  public parseLinkSpecifier(specifier: string) {
    const [routeName, arg] = specifier.split('|')

    if (!isAppRouteName(routeName)) {
      throw new TypeError(`Unknown route name: ${routeName}`)
    }

    if (isCourseContentRouteName(routeName)) {
      const contentType = routeName.split(':').pop()
      if (isContentType(contentType)) {
        if (!arg) {
          throw new TypeError(`Not a valid argument: ${arg}`)
        }

        if (contentType === 'page') {
          return { name: routeName, pageSlug: arg } as CourseContentRouteInfo<'app:course:page'>
        }
        return { name: routeName, sectionPath: arg } as CourseContentRouteInfo<'app:course:section'>
      }
    }

    return { name: routeName }
  }

  /** Match URL path */
  public match<R extends AppRouteName>(routeName: R, path: string): Match<RouteParams<R>> {
    return this.matchers[routeName](path)
  }

  /** Get all routes */
  public getAllRoutes() {
    return Object.fromEntries(this.buildPatterns(this.routes)) as Partial<Record<RouteName, string>>
  }

  /** Get API routes */
  public getApiRoutes() {
    return Object.fromEntries(this.buildPatterns(apiRoutes)) as Partial<Record<ApiRouteName, string>>
  }

  private buildRoutes() {
    // Build full patterns
    const patterns = this.buildPatterns(this.routes)

    // Build path functions
    const pathFunctions = Object.fromEntries(
      patterns.map(([routeName, pattern]) => [routeName, compile(pattern, this.parseOptions)]),
    ) as PathFunctions

    // Build matchers
    const matchers = Object.fromEntries(
      patterns.map(([routeName, pattern]) => [routeName, match(pattern, this.parseOptions)]),
    ) as Matchers

    return { pathFunctions, matchers }
  }

  private buildPatterns(routes: Partial<Record<RouteName, RouteDef>>) {
    return Object.entries(routes).map(([routeName, routeDef]) => {
      const pattern = typeof routeDef === 'string' ? routeDef : routeDef(this.routeFuncArgs)
      const fullPattern = routeName.startsWith('app') ? this.makeAppPattern(pattern) : this.makeApiPattern(pattern)
      return [routeName, fullPattern]
    }) as [RouteName, string][]
  }

  private makeAppPattern(pattern: string) {
    return this.courseSlugMode === 'URL' ? `/:locale/:courseSlug${pattern}` : `/:locale${pattern}`
  }

  private makeApiPattern(pattern: string) {
    return `${API_PREFIX}${API_COURSE_PREFIX}${pattern}`
  }
}

export default RouteManager
