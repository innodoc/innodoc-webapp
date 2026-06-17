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
  RouteDef,
  RouteFuncArgs,
  RouteName,
} from '#types'

interface RouteManagerOptions {
  config: Pick<ConfigSchema, 'courseSlugMode' | 'pagePathPrefix' | 'sectionPathPrefix'>
}

class RouteManager {
  private readonly frontendRoutes = {
    ...builtinRoutes,
    ...courseRoutes,
    ...userRoutes,
  }

  private readonly courseSlugMode: CourseSlugMode

  private routeFuncArgs: RouteFuncArgs

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
        const pattern = route[1]
        const requiredKeys = this.extractRequiredKeys(pattern)
        for (const key of requiredKeys) {
          if (!(key in params)) {
            throw new TypeError(`Expected parameter '${key}' to be present`)
          }
        }
        return inject(pattern, params)
      }
    }
    throw new TypeError('Unable to parse routeInfo object')
  }

  private extractRequiredKeys(pattern: string): string[] {
    const { keys } = parse(pattern)
    if (!keys) {
      return []
    }
    return keys.filter((key) => key !== '*' && !pattern.includes(`:${key}?`))
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
