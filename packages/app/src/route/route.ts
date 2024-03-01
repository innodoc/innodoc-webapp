import type { PageContextServer } from 'vike/types'

import getRouteManager from '@innodoc/routes/vite/getRouteManager'
import type { AppRouteName } from '@innodoc/routes/types'

const routeManager = getRouteManager()

/**
 * Factory for route function for all pages
 *
 * Match route and extract parameters.
 */
function route<T extends AppRouteName>(routeName: T) {
  return (pageContext: PageContextServer) => {
    // TODO: is this still needed?
    // Routes also need to match pageContext.json files used in client navigation
    // const removePageContextJsonRE = /\/index.pageContext.json$/
    // const url = pageContext.urlLogical.replace(removePageContextJsonRE, '')

    // Match URL against route
    const match = routeManager.match(routeName, pageContext.urlOriginal)
    if (!match) {
      return false
    }

    // locale is already handled
    if ('locale' in match.params) {
      delete match.params.locale
    }

    return {
      match: true,
      // vike doesn't allow writing to routeInfo here, so we put
      // info in routeParams and copy it to routeInfo in onBeforeRender
      routeParams: {
        name: routeName,
        ...match.params,
      },
    }
  }
}

export default route
