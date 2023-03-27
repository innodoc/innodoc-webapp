import getRouteManager from '#routes/getRouteManager'
import type { PageContextServer } from '#types/pageContext'
import type { AppRouteName } from '#types/routes'

const routeManager = getRouteManager()

const removePageContextJsonRE = /\/index.pageContext.json$/

/**
 * Factory for route function for all pages
 *
 * Match route and extract parameters.
 */
function makeRouteFunc(routeName: AppRouteName) {
  return (pageContext: PageContextServer) => {
    if (pageContext.redirectTo) {
      return false
    }

    // Routes also need to match pageContext.json files used in client navigation
    const url = pageContext.urlPathname.replace(removePageContextJsonRE, '')

    // Match URL against route
    const match = routeManager.match(routeName, url)
    if (!match) {
      return false
    }

    // locale is already handled
    if ('locale' in match.params) {
      delete match.params.locale
    }

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
