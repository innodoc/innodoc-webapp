import { getRouteManager } from '#server/utils'
import type { RouteName } from '#types/routes'

const routeManager = getRouteManager()

function printRoutes() {
  for (const [route, url] of Object.entries(routeManager.getAllRoutes()) as [RouteName, string][]) {
    console.log(`${route}\n  ${url}`)
  }
}

printRoutes()
