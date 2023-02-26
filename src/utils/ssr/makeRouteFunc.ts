import getRoutes from '#routes/getRoutes'
import type { PageContextServer } from '#types/pageContext'

const { matchUrl } = getRoutes()

/**
 * Factory for route function for content pages
 *
 * Match route and extract parameters.
 */
function makeRouteFunc(routeName: 'app:page' | 'app:section') {
  return (pageContext: PageContextServer) => {
    const match = matchUrl(routeName, pageContext.urlPathname)
    return match
      ? {
          match: true,
          routeParams: {
            routeName,
            ...match.params,
          },
        }
      : false
  }
}

export default makeRouteFunc
