import type { LanguageCode } from 'iso-639-1'

import type { ApiCourse, ApiPage, ApiSection, FragmentType } from '@innodoc/types/entities'

import type { RouteFuncArgs } from './RouteManager'

const routesApi = {
  // Course
  'api:course': '/:courseSlug',

  // Page
  'api:course:pages': '/:courseSlug/pages',
  'api:course:page:content': '/:courseSlug/pages/:locale/:pageSlug',

  // Section
  'api:course:sections': '/:courseSlug/sections',
  'api:course:section:content': '/:courseSlug/sections/:locale/:sectionPath([a-z0-9-/]*)',

  // Fragment
  'api:course:fragment:content': '/:courseSlug/fragments/:locale/:fragmentType',
}

interface ApiRouteParams {
  'api:course': { courseSlug: ApiCourse['slug'] }
  'api:course:pages': { courseSlug: ApiCourse['slug'] }
  'api:course:page:content': {
    courseSlug: ApiCourse['slug']
    locale: LanguageCode
    pageSlug: ApiPage['slug']
  }
  'api:course:sections': { courseSlug: ApiCourse['slug'] }
  'api:course:section:content': {
    courseSlug: ApiCourse['slug']
    locale: LanguageCode
    sectionPath: ApiSection['path']
  }
  'api:course:fragment:content': {
    courseSlug: ApiCourse['slug']
    locale: LanguageCode
    fragmentType: FragmentType
  }
}

const routesBuiltinPages = {
  // Landing/index page
  'app:index': '',

  // Home page (dynamic, depends on course)
  'app:home': null,

  // Progress
  'app:progress': '/progress',

  // Table of contents
  'app:toc': '/toc',

  // Glossary
  'app:glossary': '/glossary',
}

const routesContentPages = {
  // Page
  'app:page': ({ pagePathPrefix }: RouteFuncArgs) => `/${pagePathPrefix}/:pageSlug`,

  // Section
  'app:section': ({ sectionPathPrefix }: RouteFuncArgs) =>
    `/${sectionPathPrefix}/:sectionPath([a-z0-9-/]*)`,
}

interface ContentPagesRouteParams {
  'app:page': { pageSlug: ApiPage['slug'] }
  'app:section': { sectionPath: ApiSection['path'] }
}

const routesUser = {
  // Login
  'app:user:login': '/login',

  // Login
  'app:user:forgot-password': '/forgot-password',

  // Login
  'app:user:sign-up': '/sign-up',
}

type CombinedRouteParams = ApiRouteParams & ContentPagesRouteParams
type RouteParams<R> = R extends keyof CombinedRouteParams ? CombinedRouteParams[R] : never

export { routesApi, routesBuiltinPages, routesContentPages, routesUser }
export type { RouteParams }
