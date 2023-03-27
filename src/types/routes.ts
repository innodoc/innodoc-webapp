import type { routesApi, routesBuiltinPages, routesContentPages, routesUser } from '#routes/routes'

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
