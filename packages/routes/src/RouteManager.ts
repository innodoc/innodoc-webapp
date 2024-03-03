import { compile, match } from 'path-to-regexp'
import type { Match, MatchFunction, PathFunction } from 'path-to-regexp'

import { API_COURSE_PREFIX } from '@innodoc/constants'
import { isArbitraryObject, isContentType } from '@innodoc/utils/typeGuards'
import type { CourseSlugMode } from '@innodoc/types/common'

import { routesApi, routesBuiltinPages, routesContentPages, routesUser } from './routes'
import type { RouteParams } from './routes'
import type {
  ApiRouteName,
  AppRouteInfo,
  AppRouteName,
  ContentRouteName,
  ParamTypeForGenerator,
  RouteInfo,
  RouteName,
} from './types'

interface RouteFuncArgs {
  pagePathPrefix: string
  sectionPathPrefix: string
}

type Generators = {
  [key in RouteName]: PathFunction<RouteParams<key>>
}
type Matchers = {
  [key in RouteName]: MatchFunction<RouteParams<key>>
}
type RouteFunc = (args: RouteFuncArgs) => string
type RouteDef = string | RouteFunc

class RouteManager {
  private static instance: RouteManager | null

  private readonly allRoutes = {
    // exclude `app:home` as it's dynamic
    ...Object.fromEntries(Object.entries(routesBuiltinPages).filter(([key]) => key !== 'app:home')),
    ...routesContentPages,
    ...routesUser,
    ...routesApi,
  }

  private readonly appRouteNames = [
    ...Object.keys(routesBuiltinPages),
    ...Object.keys(routesContentPages),
    ...Object.keys(routesUser),
  ]

  private readonly courseSlugMode: CourseSlugMode

  private routeFuncArgs: RouteFuncArgs

  private generators: Generators

  private matchers: Matchers

  private readonly parseOptions = {
    sensitive: true,
    strict: true,
  }

  private constructor(
    courseSlugMode: CourseSlugMode,
    pagePathPrefix: string,
    sectionPathPrefix: string,
  ) {
    this.courseSlugMode = courseSlugMode
    this.routeFuncArgs = { pagePathPrefix, sectionPathPrefix }
    const { generators, matchers } = this.buildRoutes()
    this.generators = generators
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

  /** Generate URL path from route name and parameters */
  public generate<R extends RouteName>(routeInfo: RouteInfo<R>): string
  public generate<R extends RouteName>(routeName: R, params?: RouteParams<R>): string
  public generate<R extends RouteName>(
    nameOrInfo: R | RouteInfo<R>,
    params?: RouteParams<R>,
  ): string {
    if (this.isRouteName(nameOrInfo)) {
      return this.generators[nameOrInfo](params as ParamTypeForGenerator<R>)
    }
    if (this.isRouteInfo(nameOrInfo)) {
      if (params) {
        throw Error('params must be undefined if RouteInfo is given')
      }
      const { name, ...routeInfoParams } = nameOrInfo
      return this.generate(name, routeInfoParams as ParamTypeForGenerator<R>)
    }
    throw Error('Wrong argument')
  }

  /**
   * Parse link specifier.
   *
   * Link specifiers take the form `ROUTE_NAME|ROUTE_PARAMS` (e.g.
   * `app:page|about`).
   *
   * @params specifier Link specifier
   * @returns `RouteInfo` object
   */
  public parseLinkSpecifier(specifier: string): Omit<AppRouteInfo, 'locale' | 'courseSlug'> {
    const [routeName, arg] = specifier.split('|')

    if (!this.isAppRouteName(routeName)) {
      throw new Error(`Unknown route name: ${routeName}`)
    }

    if (this.isContentRouteName(routeName)) {
      const contentType = routeName.split(':')[1]
      if (isContentType(contentType)) {
        if (contentType === 'page') {
          return { name: routeName, pageSlug: arg } as AppRouteInfo<'app:page'>
        }
        return { name: routeName, sectionPath: arg } as AppRouteInfo<'app:section'>
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
    return Object.fromEntries(this.buildPatterns(this.allRoutes)) as Partial<
      Record<RouteName, string>
    >
  }

  /** Get API routes */
  public getApiRoutes() {
    return Object.fromEntries(this.buildPatterns(routesApi)) as Partial<
      Record<ApiRouteName, string>
    >
  }

  /** Type guard for `RouteName` */
  public isRouteName(routeName: unknown): routeName is RouteName {
    return (
      typeof routeName === 'string' && Object.keys(this.generators).includes(routeName as RouteName)
    )
  }

  /** Type guard for `AppRouteName` */
  public isAppRouteName(routeName: unknown): routeName is AppRouteName {
    return typeof routeName === 'string' && this.appRouteNames.includes(routeName)
  }

  /** Type guard for `ContentRouteName` */
  public isContentRouteName(routeName: unknown): routeName is ContentRouteName {
    return typeof routeName === 'string' && Object.keys(routesContentPages).includes(routeName)
  }

  /** Type guard for `RouteInfo` */
  public isRouteInfo<R extends RouteName>(t: unknown, routeName?: R): t is RouteInfo<R> {
    return isArbitraryObject(t) && (routeName ? t.name === routeName : this.isRouteName(t.name))
  }

  private buildRoutes() {
    // Build full patterns
    const patterns = this.buildPatterns(this.allRoutes)

    // Build generators
    const generators = Object.fromEntries(
      patterns.map(([routeName, pattern]) => [routeName, compile(pattern, this.parseOptions)]),
    ) as Generators

    // Build matchers
    const matchers = Object.fromEntries(
      patterns.map(([routeName, pattern]) => [routeName, match(pattern, this.parseOptions)]),
    ) as Matchers

    return { generators, matchers }
  }

  private buildPatterns(routes: Partial<Record<RouteName, RouteDef>>) {
    return Object.entries(routes).map(([routeName, routeDef]) => {
      const pattern = typeof routeDef === 'string' ? routeDef : routeDef(this.routeFuncArgs)
      const fullPattern = routeName.startsWith('app')
        ? this.makeAppPattern(pattern)
        : this.makeApiPattern(pattern)
      return [routeName, fullPattern]
    }) as [RouteName, string][]
  }

  private makeAppPattern(pattern: string) {
    const localeRoute = `/:locale${pattern}`
    return this.courseSlugMode === 'URL' ? `/:courseSlug/${localeRoute}` : localeRoute
  }

  private makeApiPattern(pattern: string) {
    return `${API_COURSE_PREFIX}${pattern}`
  }
}

export type { ParamTypeForGenerator, RouteFuncArgs }
export default RouteManager
