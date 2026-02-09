import type { apiRoutes, builtinRoutes, courseContentRoutes, courseRoutes, userRoutes } from '#routes'

/** API route name */
type ApiRouteName = keyof typeof apiRoutes

/** Built-in route name */
type BuiltinRouteName = keyof typeof builtinRoutes

/** Course route name */
type CourseRouteName = keyof typeof courseRoutes

/** Course page/section route name */
type CourseContentRouteName = keyof typeof courseContentRoutes

/** User page route name */
type UserRouteName = keyof typeof userRoutes

/** App route name */
type AppRouteName = BuiltinRouteName | CourseRouteName | UserRouteName

/** Route name */
type RouteName = ApiRouteName | AppRouteName

export type {
  ApiRouteName,
  AppRouteName,
  BuiltinRouteName,
  CourseContentRouteName,
  CourseRouteName,
  RouteName,
  UserRouteName,
}
