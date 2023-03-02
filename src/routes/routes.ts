import type { RouteFuncArgs } from './RouteManager'

export type RouteName =
  | keyof typeof routesBuiltinPages
  | keyof typeof routesContentPages
  | keyof typeof routesUser
  | keyof typeof routesApi

type RouteFunc = (args: RouteFuncArgs) => string
export type RouteDef = string | RouteFunc

export const routesBuiltinPages = {
  // Landing/index page
  'app:index': '',

  // Progress
  'app:progress': '/progress',

  // Table of contents
  'app:toc': '/toc',

  // Glossary
  'app:glossary': '/glossary',
}

export type BuiltinPageRouteName = keyof typeof routesBuiltinPages

export const routesContentPages = {
  // Page
  'app:page': ({ pagePathPrefix, SLUG_RE }: RouteFuncArgs) =>
    `/${pagePathPrefix}/:pageSlug(${SLUG_RE})`,

  // Section
  'app:section': ({ sectionPathPrefix, PATH_RE }: RouteFuncArgs) =>
    `/${sectionPathPrefix}/:sectionPath(${PATH_RE})`,
}

export const routesUser = {
  // Login
  'app:user:login': '/login',
}

export const routesApi = {
  // Course
  'api:course': ({ NUMBER_RE }: RouteFuncArgs) => `/:courseId(${NUMBER_RE})`,

  // Page
  'api:course:pages': ({ NUMBER_RE }: RouteFuncArgs) => `/:courseId(${NUMBER_RE})/pages`,
  'api:course:page:content': ({ LOCALE_RE, NUMBER_RE }: RouteFuncArgs) =>
    `/:courseId(${NUMBER_RE})/page/:locale(${LOCALE_RE})/:pageId(${NUMBER_RE})`,

  // Section
  'api:course:sections': ({ NUMBER_RE }: RouteFuncArgs) => `/:courseId(${NUMBER_RE})/sections`,
  'api:course:section:content': ({ LOCALE_RE, NUMBER_RE }: RouteFuncArgs) =>
    `/:courseId(${NUMBER_RE})/section/:locale(${LOCALE_RE})/:sectionId(${NUMBER_RE})`,

  // Fragment
  'api:course:fragment:content': ({ FRAGMENT_RE, LOCALE_RE, NUMBER_RE }: RouteFuncArgs) =>
    `/:courseId(${NUMBER_RE})/fragment/:locale(${LOCALE_RE})/:fragmentType(${FRAGMENT_RE})`,
}
