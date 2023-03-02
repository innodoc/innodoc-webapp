import type { routesApi, routesBuiltinPages, routesContentPages, routesUser } from '#routes/routes'

/** All route names */
export type RouteName =
  | keyof typeof routesBuiltinPages
  | keyof typeof routesContentPages
  | keyof typeof routesUser
  | keyof typeof routesApi

/** Built-in page route names */
export type BuiltinPageRouteName = keyof typeof routesBuiltinPages

/** Api route names */
export type ApiRouteName = keyof typeof routesApi
