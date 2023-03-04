import type { LanguageCode } from 'iso-639-1'
import { compile, match, type MatchFunction, type PathFunction } from 'path-to-regexp'

import { API_COURSE_PREFIX, FRAGMENT_RE, PATH_RE, SLUG_RE } from '#constants'
import type { CourseSlugMode } from '#types/common'
import { isContentType } from '#types/typeGuards'
import { getStringIdField } from '#utils/content'

import {
  type RouteName,
  routesBuiltinPages,
  routesContentPages,
  routesUser,
  routesApi,
  type RouteDef,
  type BuiltinPageRouteName,
} from './routes'

export interface RouteFuncArgs {
  pagePathPrefix: string
  sectionPathPrefix: string
  FRAGMENT_RE: string
  LOCALE_RE: string
  NUMBER_RE: string
  PATH_RE: string
  SLUG_RE: string
}

type Generators = Record<RouteName, PathFunction>
type Matchers = Record<RouteName, MatchFunction>

class RouteManager {
  private static instance: RouteManager

  private readonly allRoutes = {
    ...routesBuiltinPages,
    ...routesContentPages,
    ...routesUser,
    ...routesApi,
  }

  private readonly LOCALE_RE = '[a-z]{2}'

  private readonly NUMBER_RE = '[0-9]+'

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
    this.routeFuncArgs = {
      pagePathPrefix,
      sectionPathPrefix,
      FRAGMENT_RE: FRAGMENT_RE,
      LOCALE_RE: this.LOCALE_RE,
      NUMBER_RE: this.NUMBER_RE,
      PATH_RE,
      SLUG_RE,
    }
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
  public generate(routeName: RouteName, params: object) {
    return this.generators[routeName](params)
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

  /** TypeGuard for `RouteName` */
  public isRouteName(routeName: unknown): routeName is RouteName {
    return (
      typeof routeName === 'string' && Object.keys(this.generators).includes(routeName as RouteName)
    )
  }

  /** TypeGuard for `BuiltinPageRouteName` */
  public isBuiltinPageRouteName(routeName: unknown): routeName is BuiltinPageRouteName {
    return typeof routeName === 'string' && Object.keys(routesBuiltinPages).includes(routeName)
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
    const localeRoute = `/:locale(${this.LOCALE_RE})${pattern}`
    return this.courseSlugMode === 'URL' ? `/:courseSlug(${SLUG_RE})/${localeRoute}` : localeRoute
  }

  private makeApiPattern(pattern: string) {
    return `${API_COURSE_PREFIX}${pattern}`
  }
}

export default RouteManager
