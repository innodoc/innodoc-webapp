#!/usr/bin/env tsx

import config from '@innodoc/config'
import getRouteManager from '@innodoc/routes/node/getRouteManager'
import type { RouteName } from '@innodoc/routes/types/routeNames'

const routeManager = getRouteManager(config)

function printRoutes() {
  for (const [route, url] of Object.entries(routeManager.getAllRoutes()) as [RouteName, string][]) {
    console.log(`${route}\n  ${url}`)
  }
}

printRoutes()
