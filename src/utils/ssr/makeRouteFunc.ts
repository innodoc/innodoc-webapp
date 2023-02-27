import getRoutes from '#routes/getRoutes'
import type { ContentType } from '#types/common'
import type { PageContextServer } from '#types/pageContext'

const { matchUrl } = getRoutes()

/**
 * Factory for route function for content pages
 *
 * Match route and extract parameters.
 */
function makeRouteFunc(contentType: ContentType) {
  const routeName = `app:${contentType}`

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
