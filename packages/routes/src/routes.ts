import type { RouteFuncArgs } from './RouteManager'

export const routesBuiltinPages = {
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

export const routesContentPages = {
  // Page
  'app:page': ({ pagePathPrefix }: RouteFuncArgs) => `/${pagePathPrefix}/:pageSlug`,

  // Section
  'app:section': ({ sectionPathPrefix }: RouteFuncArgs) =>
    `/${sectionPathPrefix}/:sectionPath([a-z0-9-/]*)`,
}

export const routesUser = {
  // Login
  'app:user:login': '/login',

  // Login
  'app:user:forgot-password': '/forgot-password',

  // Login
  'app:user:sign-up': '/sign-up',
}

export const routesApi = {
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
