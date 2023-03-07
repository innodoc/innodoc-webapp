import type { LanguageCode } from 'iso-639-1'
import { compile, match, type MatchFunction, type PathFunction } from 'path-to-regexp'

import { API_COURSE_PREFIX } from '#constants'
import type { CourseSlugMode, RouteInfo } from '#types/common'
import type { BuiltinPageRouteName, RouteName } from '#types/routes'
import { isArbitraryObject, isContentType } from '#types/typeGuards'
import { getStringIdField } from '#utils/content'

import { routesBuiltinPages, routesContentPages, routesUser, routesApi } from './routes'

export interface RouteFuncArgs {
  pagePathPrefix: string
  sectionPathPrefix: string
}

type Generators = Record<RouteName, PathFunction>
type Matchers = Record<RouteName, MatchFunction>
type RouteFunc = (args: RouteFuncArgs) => string
type RouteDef = string | RouteFunc

class RouteManager {
  private static instance: RouteManager

  private readonly allRoutes = {
    ...routesBuiltinPages,
    ...routesContentPages,
    ...routesUser,
    ...routesApi,
  }

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
    sectionPathPrefix: string
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
    sectionPathPrefix: string
  ): RouteManager {
    if (!RouteManager.instance) {
      RouteManager.instance = new RouteManager(courseSlugMode, pagePathPrefix, sectionPathPrefix)
    }

    return RouteManager.instance
  }

  /** Generate URL path from route name and parameters */
  public generate(routeInfo: RouteInfo): string
  public generate(routeName: RouteName, params: object): string
  public generate(nameOrInfo: RouteInfo | RouteName, params?: object) {
    if (this.isRouteInfo(nameOrInfo)) {
      const { routeName, ...routeArgs } = nameOrInfo
      return this.generate(routeName, routeArgs)
    }
    return this.generators[nameOrInfo](params)
  }

  /** Parse link specifier params */
  public generateParamsFromSpecifier(
    specifier: string,
    locale?: LanguageCode
  ): [RouteName, Record<string, string>] {
    const [routeName, arg] = specifier.split('|')
    if (!this.isRouteName(routeName)) {
      throw new Error(`Unknown route name: ${routeName}`)
    }

    const [routeNameFirst, routeNameSecond] = routeName.split(':')
    if (routeNameFirst !== 'app') {
      throw new Error(`Link specifier must start with 'app:', but got ${specifier}`)
    }

    const params: Record<string, string> = {}
    if (locale) {
      params.locale = locale
    }

    if (isContentType(routeNameSecond)) {
      params[getStringIdField(routeNameSecond)] = arg
    }

    return [routeName, params]
  }

  /** Parse link specifier such as `section|foo/bar` */
  public generateFromSpecifier(specifier: string, locale: LanguageCode) {
    const [routeName, params] = this.generateParamsFromSpecifier(specifier, locale)
    return this.generate(routeName, params)
  }

  /** Match URL path */
  public match(routeName: RouteName, path: string) {
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
    return Object.fromEntries(this.buildPatterns(routesApi)) as Partial<Record<RouteName, string>>
  }

  /** Type guard for `RouteName` */
  public isRouteName(routeName: unknown): routeName is RouteName {
    return (
      typeof routeName === 'string' && Object.keys(this.generators).includes(routeName as RouteName)
    )
  }

  /** Type guard for `BuiltinPageRouteName` */
  public isBuiltinPageRouteName(routeName: unknown): routeName is BuiltinPageRouteName {
    return typeof routeName === 'string' && Object.keys(routesBuiltinPages).includes(routeName)
  }

  /** Type guard for `RouteInfo` */
  public isRouteInfo(t: unknown): t is RouteInfo {
    return isArbitraryObject(t) && this.isRouteName(t.routeName)
  }

  private buildRoutes() {
    // Build full patterns
    const patterns = this.buildPatterns(this.allRoutes)

    // Build generators
    const generators = Object.fromEntries(
      patterns.map(([routeName, pattern]) => [routeName, compile(pattern, this.parseOptions)])
    ) as Generators

    // Build matchers
    const matchers = Object.fromEntries(
      patterns.map(([routeName, pattern]) => [routeName, match(pattern, this.parseOptions)])
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

export default RouteManager
