import type { RouteName } from '@innodoc/routes/types'

import getRouteManager from '@innodoc/routes/node/getRouteManager'
import config from '@innodoc/server/config'

const routeManager = getRouteManager(config)

function printRoutes() {
  for (const [route, url] of Object.entries(routeManager.getAllRoutes()) as [RouteName, string][]) {
    console.log(`${route}\n  ${url}`)
  }
}

printRoutes()
