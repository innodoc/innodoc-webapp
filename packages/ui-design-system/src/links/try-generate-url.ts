import type { FrontendRouteInfo } from '@innodoc/shared-core/types'

/** URL generator as provided by `useRoutes().url` */
type UrlGenerator = (routeInfo: Partial<FrontendRouteInfo>) => string

/**
 * Generate a link href, or return `null` if the route info misses a required parameter.
 *
 * Route info can legitimately be unresolvable: course routes need a `courseSlug`, which non-course
 * routes (`app:index`, `app:user:*`) do not carry. Link components must not throw in that case - an
 * unhandled render error unmounts the whole app on the client and blanks the entire SSR response -
 * so the link is dropped instead.
 *
 * @param generateUrl URL generator (typically `useRoutes().url`)
 * @param routeInfo Route info to resolve
 * @returns URL path, or `null` if it cannot be generated
 */
function tryGenerateUrl(generateUrl: UrlGenerator, routeInfo: Partial<FrontendRouteInfo>): string | null {
  try {
    return generateUrl(routeInfo)
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('[ui-design-system/links] Unable to generate URL for route info:', routeInfo, error)
    }

    return null
  }
}

export default tryGenerateUrl
