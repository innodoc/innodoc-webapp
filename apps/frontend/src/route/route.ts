import type { PageContextServer } from 'vike/types'

import getRouteManager from '@innodoc/routes/vite/getRouteManager'
import type { AppRouteName } from '@innodoc/routes/types/routeNames'

const routeManager = getRouteManager()

/**
 * Factory for route function for all pages
 *
 * Match route and extract parameters.
 */
function route(routeName: AppRouteName) {
  const routeFunc = ({ urlOriginal }: PageContextServer) => {
    // Routes also need to match pageContext.json files used in client navigation
    let url = urlOriginal
    if (import.meta.env.SSR) {
      url = urlOriginal.replace(/\/index\.pageContext\.json$/, '')
    }

    // Match URL against route
    const match = routeManager.match(routeName, url)
    if (!match) {
      return false
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

  // Pretty-print route in dev mode
  routeFunc.toString = () => routeName

  return routeFunc
}

export default route
