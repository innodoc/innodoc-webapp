import type { LanguageCode } from 'iso-639-1'

import type { ApiCourse } from '@innodoc/types/entities'

import type {
  RouteParams,
  routesApi,
  routesBuiltinPages,
  routesContentPages,
  routesUser,
} from './routes'

/** API route name */
type ApiRouteName = keyof typeof routesApi

/** Built-in page route name */
type BuiltinRouteName = keyof typeof routesBuiltinPages

/** Content page route name */
type ContentRouteName = keyof typeof routesContentPages

/** User page route name */
type UserRouteName = keyof typeof routesUser

/** App route name */
type AppRouteName = BuiltinRouteName | ContentRouteName | UserRouteName

/** Route name */
type RouteName = AppRouteName | ApiRouteName

interface BaseRouteParams {
  /** Course slug */
  courseSlug: ApiCourse['slug'] | null

  /** Current locale */
  locale: LanguageCode
}

interface BaseRouteInfo<R extends RouteName = RouteName> extends BaseRouteParams {
  /** Route name */
  name: R
}

/** API route info */
type ApiRouteInfo<R extends ApiRouteName = ApiRouteName> = BaseRouteInfo<R> & RouteParams<R>

/** Built-in page route info */
type BuiltinRouteInfo<R extends BuiltinRouteName = BuiltinRouteName> = BaseRouteInfo<R>

/** Content page route info */
type ContentRouteInfo<R extends ContentRouteName = ContentRouteName> = BaseRouteInfo<R> &
  RouteParams<R>

/** User page route info */
type UserRouteInfo<R extends UserRouteName = UserRouteName> = BaseRouteInfo<R>

/** App route info */
type AppRouteInfo<R extends AppRouteName = AppRouteName> =
  | (R extends BuiltinRouteName ? BuiltinRouteInfo<R> : never)
  | (R extends ContentRouteName ? ContentRouteInfo<R> : never)
  | (R extends UserRouteName ? UserRouteInfo<R> : never)

/** Route info */
type RouteInfo<R extends RouteName = RouteName> =
  | (R extends AppRouteName ? AppRouteInfo<R> : never)
  | (R extends ApiRouteName ? ApiRouteInfo<R> : never)

/* Extract specific parameter type expected by generator function */
type ParamTypeForGenerator<R extends RouteName> =
  RouteParams<R> extends infer P ? (P extends object ? P : never) : never

export type {
  ApiRouteInfo,
  ApiRouteName,
  AppRouteInfo,
  AppRouteName,
  BuiltinRouteName,
  ContentRouteInfo,
  ContentRouteName,
  ParamTypeForGenerator,
  RouteInfo,
  RouteName,
}
