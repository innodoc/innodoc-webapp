import getRoutes from '#routes/getRoutes'
import type { RouteName } from '#routes/routes'
import type { PageContextServer } from '#types/pageContext'

const { matchUrl } = getRoutes()

const removePageContextJsonRE = /\/index.pageContext.json$/

/**
 * Factory for route function for content pages
 *
 * Match route and extract parameters.
 */
function makeRouteFunc(routeName: RouteName) {
  return (pageContext: PageContextServer) => {
    if (pageContext.redirectTo) return false
    const { routeInfo } = pageContext
    const { urlPristine } = routeInfo
    if (urlPristine === undefined) throw new Error(`pageContext.routeInfo.urlPristine is undefined`)

    // Routes also need to match th pageContext.json files used in client navigation
    const url = urlPristine.replace(removePageContextJsonRE, '')

    // Match URL against route
    const match = matchUrl(routeName, url)
    if (!match) return false

    // locale is already handled
    if ('locale' in match.params) delete match.params.locale

    return {
      match: true,
      // vite-plugin-ssr doesn't allow writing to routeInfo here, so we put
      // info in routeParams and copy it to routeInfo in onBeforeRender
      routeParams: {
        routeName,
        ...match.params,
      },
    }
  }
}

export default makeRouteFunc
