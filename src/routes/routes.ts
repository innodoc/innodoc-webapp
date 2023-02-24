import { compile, match, type Match } from 'path-to-regexp'

import { API_COURSE_PREFIX, FRAGMENT_RE, PATH_RE, SLUG_RE } from '#constants'
import type { CourseSlugMode } from '#types/common'

/** Locale ISO-639-1 language code */
const LOCALE_RE = '[a-z]{2}'

/** Number regex */
const NUMBER_RE = '\\d+'

const parseOptions = {
  sensitive: true,
  strict: true,
}

interface RouteManager {
  frontendRoutes: Record<string, string>
  apiRoutes: Record<string, string>
  routes: Record<string, string>
  generateUrl: (name: string, params: Record<string, string>) => string
  matchUrl: (name: string, path: string) => Match
}

let cachedRoutes: RouteManager

function makeRoutes(
  courseSlugMode: CourseSlugMode,
  pagePathPrefix: string,
  sectionPathPrefix: string
): RouteManager {
  const appRoute = (route: string) => {
    const localeRoute = `/:locale(${LOCALE_RE})/${route}`
    return courseSlugMode === 'URL' ? `/:courseSlug(${SLUG_RE})/${localeRoute}` : localeRoute
  }

  const apiRoute = (route: string) => `${API_COURSE_PREFIX}/${route}`

  const frontendRoutes = {
    // Page
    'app:page': appRoute(`${pagePathPrefix}/:pageSlug(${SLUG_RE})`),

    // Section
    'app:section': appRoute(`${sectionPathPrefix}/:sectionPath(${PATH_RE})`),

    // Progress
    'app:progress': appRoute('progress'),

    // Table of contents
    'app:toc': appRoute('toc'),

    // Glossary
    'app:glossary': appRoute('glossary'),

    // User login
    'app:user:login': appRoute('login'),
  }

  const apiRoutes = {
    // Course
    'api:course': apiRoute(`:courseId(${NUMBER_RE})`),

    // Page
    'api:course:pages': apiRoute(`:courseId(${NUMBER_RE})/pages`),
    'api:course:page:content': apiRoute(
      `:courseId(${NUMBER_RE})/page/:locale(${LOCALE_RE})/:pageId(${NUMBER_RE})`
    ),

    // Section
    'api:course:sections': apiRoute(`:courseId(${NUMBER_RE})/sections`),
    'api:course:section:content': apiRoute(
      `:courseId(${NUMBER_RE})/section/:locale(${LOCALE_RE})/:sectionId(${NUMBER_RE})`
    ),

    // Fragment
    'api:course:fragment:content': apiRoute(
      `:courseId(${NUMBER_RE})/fragment/:locale(${LOCALE_RE})/:fragmentType(${FRAGMENT_RE})`
    ),
  }

  const routes = { ...frontendRoutes, ...apiRoutes }

  const generators = Object.fromEntries(
    Object.entries(routes).map(([name, pattern]) => [name, compile(pattern, parseOptions)])
  )

  const matchers = Object.fromEntries(
    Object.entries(routes).map(([name, pattern]) => [name, match(pattern, parseOptions)])
  )

  return {
    /** Application frontend routes */
    frontendRoutes,

    /** Application API routes */
    apiRoutes,

    /** Application routes */
    routes,

    /** Generate URL path from route name and parameters */
    generateUrl: (routeName, params) => generators[routeName](params),

    /** Match URL path */
    matchUrl: (routeName, path) => matchers[routeName](path),
  }
}

function routes(courseSlugMode: CourseSlugMode, pagePathPrefix: string, sectionPathPrefix: string) {
  if (!cachedRoutes) cachedRoutes = makeRoutes(courseSlugMode, pagePathPrefix, sectionPathPrefix)
  return cachedRoutes
}

export default routes
