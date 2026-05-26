#!/usr/bin/env node

import chalk from 'chalk'
import parseConfig from '@innodoc/server-env'
import { RouteManager } from '@innodoc/shared-core/routes'

function printRoutes() {
  const config = parseConfig()
  const routeManager = new RouteManager({ config })
  const routes = routeManager.getAllRoutes()

  const maxRouteNameLength = Math.max(...Object.keys(routes).map((routeName) => routeName.length))

  for (const [routeName, urlPath] of Object.entries(routes)) {
    console.log(`${chalk.blueBright(routeName.padEnd(maxRouteNameLength))} ${chalk.whiteBright(urlPath)}`)
  }
}

printRoutes()
