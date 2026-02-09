import type { LanguageCode } from 'iso-639-1'

import type { ApiCourse } from '@innodoc/schema/types'

import type { RouteParams } from './common.js'
import type {
  AppRouteName,
  BuiltinRouteName,
  CourseContentRouteName,
  CourseRouteName,
  RouteName,
  UserRouteName,
} from './routeNames.js'

interface BaseRouteInfo<R extends RouteName = RouteName> {
  /** Route name */
  name: R

  /** Current locale */
  locale: LanguageCode
}

/** Built-in page route info */
type BuiltinRouteInfo<R extends BuiltinRouteName = BuiltinRouteName> = BaseRouteInfo<R>

/** Course page route info */
type CourseRouteInfo<R extends CourseRouteName = CourseRouteName> = BaseRouteInfo<R> &
  RouteParams<R> & {
    /** Course slug */
    courseSlug: ApiCourse['slug']
  }

/** Course content page route info */
type CourseContentRouteInfo<R extends CourseContentRouteName = CourseContentRouteName> = CourseRouteInfo<R>

/** Course section route info */
type CourseSectionRouteInfo = CourseContentRouteInfo<'app:course:section'>

/** Course page route info */
type CoursePageRouteInfo = CourseContentRouteInfo<'app:course:page'>

/** User page route info */
type UserRouteInfo<R extends UserRouteName = UserRouteName> = BaseRouteInfo<R>

/** App route info */
type AppRouteInfo<R extends AppRouteName = AppRouteName> =
  | (R extends BuiltinRouteName ? BuiltinRouteInfo<R> : never)
  | (R extends CourseRouteName ? CourseRouteInfo<R> : never)
  | (R extends UserRouteName ? UserRouteInfo<R> : never)

export type {
  AppRouteInfo,
  BuiltinRouteInfo,
  CourseContentRouteInfo,
  CoursePageRouteInfo,
  CourseRouteInfo,
  CourseSectionRouteInfo,
  UserRouteInfo,
}
