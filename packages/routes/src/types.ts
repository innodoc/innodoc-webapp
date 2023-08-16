import type { ApiCourse, ApiPage, ApiSection } from '@innodoc/types/entities'
import type { LanguageCode } from 'iso-639-1'

import type { routesApi, routesBuiltinPages, routesContentPages, routesUser } from './routes'

/** Api route names */
export type ApiRouteName = keyof typeof routesApi

/** Built-in page route names */
export type BuiltinRouteName = keyof typeof routesBuiltinPages | 'app:home'

/** Content page route names */
type ContentRouteName = keyof typeof routesContentPages

/** User page route names */
type UserRouteName = keyof typeof routesUser

/** App route names */
export type AppRouteName = BuiltinRouteName | ContentRouteName | UserRouteName

/** All route names */
export type RouteName = AppRouteName | ApiRouteName

/** Application route info */
export interface RouteInfo {
  /** Course slug */
  courseSlug: ApiCourse['slug'] | null

  /** Route name */
  routeName: AppRouteName

  /** Current locale */
  locale: LanguageCode

  /** Page slug */
  pageSlug?: ApiPage['slug']

  /** Section path */
  sectionPath?: ApiSection['path']
}
