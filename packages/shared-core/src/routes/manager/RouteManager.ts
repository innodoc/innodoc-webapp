// import { compile, match } from 'path-to-regexp'
// import type { Match, MatchFunction, PathFunction } from 'path-to-regexp'
import { inject, parse } from 'regexparam'

import { API_COURSE_PREFIX, API_PREFIX } from '#constants'
import { apiRoutes, builtinRoutes, courseRoutes, userRoutes } from '#routes'
import { isContentType, isCourseContentRouteName, isFrontendRouteInfo, isFrontendRouteName } from '#typeguards'
import type {
  ApiRouteName,
  ApiRouteParams,
  ConfigSchema,
  CourseContentRouteInfo,
  CourseSlugMode,
  FrontendRouteName,
  ParamsForGenerator,
  RouteDef,
  RouteFuncArgs,
  RouteName,
  RouteParams,
} from '#types'

// type PathFunctions = {
//   [key in RouteName]: PathFunction<RouteParams<key>>
// }
// type Matchers = {
//   [key in RouteName]: MatchFunction<RouteParams<key>>
// }

interface RouteManagerOptions {
  config: Pick<ConfigSchema, 'courseSlugMode' | 'pagePathPrefix' | 'sectionPathPrefix'>
}

class RouteManager {
  private readonly frontendRoutes = {
    ...builtinRoutes,
    ...courseRoutes,
    ...userRoutes,
  }

  // private readonly routes = {
  //   ...apiRoutes,
  //   ...this.appRoutes,
  // }

  private readonly courseSlugMode: CourseSlugMode

  private routeFuncArgs: RouteFuncArgs

  // private pathFunctions: PathFunctions

  // private matchers: Matchers

  private apiPatterns: [ApiRouteName, string][]
  private frontendPatterns: [FrontendRouteName, string][]

  private readonly parseOptions = {
    sensitive: true,
    strict: true,
  }

  constructor({ config: { courseSlugMode, pagePathPrefix, sectionPathPrefix } }: RouteManagerOptions) {
    this.courseSlugMode = courseSlugMode
    this.routeFuncArgs = { pagePathPrefix, sectionPathPrefix }
    this.apiPatterns = this.buildPatterns(apiRoutes)
    this.frontendPatterns = this.buildPatterns(this.frontendRoutes)
    // const { pathFunctions, matchers } = this.buildRoutes()
    // this.pathFunctions = pathFunctions
    // this.matchers = matchers
  }

  /**
   * Generate app URL path from route name and parameters.
   *
   * @param routeInfo route info object
   * @returns URL
   */
  public generateFrontendUrlPath(routeInfo: Record<string, unknown>): string {
    if (isFrontendRouteInfo(routeInfo)) {
      const { name, ...params } = routeInfo

      const route = this.frontendPatterns.find(([n]) => n === name)
      if (route) {
        return inject(route[1], params)
      }

      // return this.pathFunctions[name](params as ParamsForGenerator<typeof name>)
    }
    throw new TypeError('Unable to parse routeInfo object')
  }

  /**
   * Generate API URL path from route name and parameters.
   *
   * @param routeInfo route info object
   * @returns URL
   */
  public generateApiUrlPath<R extends ApiRouteName>(name: R, params: ApiRouteParams[R]): string {
    const route = this.apiPatterns.find(([n]) => n === name)
    if (route) {
      return inject(route[1], params)
    }

    throw new TypeError(`API route not found: '${name}'`)
    // return this.pathFunctions[name](params as ParamsForGenerator<R>)
  }

  /**
   *
   * Parse link specifier.
   *
   * Link specifiers take the form `ROUTE_NAME|ROUTE_PARAMS` (e.g.
   * `app:section:page|about`).
   *
   * @params specifier Link specifier
   * @returns `FrontendRouteInfo` object
   */
  public parseLinkSpecifier(specifier: string) {
    const [routeName, arg] = specifier.split('|')

    if (!isFrontendRouteName(routeName)) {
      throw new TypeError(`Unknown route name: ${routeName ?? 'undefined'}`)
    }

    if (isCourseContentRouteName(routeName)) {
      const contentType = routeName.split(':').pop()
      if (isContentType(contentType)) {
        if (!arg) {
          throw new TypeError(`Not a valid argument: ${arg ?? 'undefined'}`)
        }

        if (contentType === 'page') {
          return { name: routeName, pageSlug: arg } as CourseContentRouteInfo<'app:course:page'>
        }
        return { name: routeName, sectionPath: arg } as CourseContentRouteInfo<'app:course:section'>
      }
    }

    return { name: routeName }
  }

  /** Match URL path. */
  // public match<R extends FrontendRouteName>(routeName: R, path: string): Match<RouteParams<R>> {
  //   return this.matchers[routeName](path)
  // }

  /** Get all routes. */
  public getAllRoutes() {
    return { ...this.getApiRoutes(), ...this.getFrontendRoutes() }
  }

  /** Get API routes. */
  public getApiRoutes() {
    return Object.fromEntries(this.buildPatterns(apiRoutes)) as Partial<Record<ApiRouteName, string>>
  }

  /** Get frontend routes. */
  public getFrontendRoutes() {
    return Object.fromEntries(this.buildPatterns(this.frontendRoutes)) as Partial<Record<FrontendRouteName, string>>
  }

  // private buildRoutes() {
  //   // Build full patterns
  //   const patterns = this.buildPatterns(this.routes)

  //   // Build path functions
  //   const pathFunctions = Object.fromEntries(
  //     patterns.map(([routeName, pattern]) => [routeName, parse(pattern).pattern]),
  //   ) as PathFunctions
  //   // const pathFunctions = Object.fromEntries(
  //   //   patterns.map(([routeName, pattern]) => [routeName, compile(pattern, this.parseOptions)]),
  //   // ) as PathFunctions

  //   return pathFunctions

  //   // Build matchers
  //   // const matchers = Object.fromEntries(
  //   //   patterns.map(([routeName, pattern]) => [routeName, match(pattern, this.parseOptions)]),
  //   // ) as Matchers

  //   // return { pathFunctions, matchers }
  // }

  private buildPatterns<T extends RouteName>(routes: Partial<Record<T, RouteDef>>): [T, string][] {
    const entries = Object.entries(routes) as [T, RouteDef][]

    return entries.map(([routeName, routeDef]) => {
      const pattern = typeof routeDef === 'string' ? routeDef : routeDef(this.routeFuncArgs)
      const fullPattern = routeName.startsWith('app') ? this.makeAppPattern(pattern) : this.makeApiPattern(pattern)

      return [routeName, fullPattern]
    })
  }

  private makeAppPattern(pattern: string) {
    // Remove course slug parameter from URL pattern if we use single course or sub-domain mode
    return this.courseSlugMode === 'URL' ? `/:locale${pattern}` : `/:locale${pattern.replace(/\/:courseSlug/, '')}`
  }

  private makeApiPattern(pattern: string) {
    return `${API_PREFIX}${API_COURSE_PREFIX}${pattern}`
  }
}

export default RouteManager
