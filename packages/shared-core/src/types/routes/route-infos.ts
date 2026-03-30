import type { LanguageCode } from 'iso-639-1'

import type { ApiCourse } from '#types'

import type { RouteParams } from './common.js'
import type {
  BuiltinRouteName,
  CourseContentRouteName,
  CourseRouteName,
  FrontendRouteName,
  RouteName,
  UserRouteName,
} from './route-names.js'

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

/** Frontend route info */
type FrontendRouteInfo<R extends FrontendRouteName = FrontendRouteName> =
  | (R extends BuiltinRouteName ? BuiltinRouteInfo<R> : never)
  | (R extends CourseRouteName ? CourseRouteInfo<R> : never)
  | (R extends UserRouteName ? UserRouteInfo<R> : never)

export type {
  BuiltinRouteInfo,
  CourseContentRouteInfo,
  CoursePageRouteInfo,
  CourseRouteInfo,
  CourseSectionRouteInfo,
  FrontendRouteInfo,
  UserRouteInfo,
}
