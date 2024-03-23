#!/usr/bin/env node

import chalk from 'chalk'

import config from '@innodoc/config'
import getRouteManager from '@innodoc/routes/node/getRouteManager'

function printRoutes() {
  const routeManager = getRouteManager(config)
  const routes = routeManager.getAllRoutes()

  const maxRouteNameLength = Math.max(...Object.keys(routes).map((routeName) => routeName.length))

  for (const [routeName, urlPath] of Object.entries(routes)) {
    console.log(`${chalk.blueBright(routeName.padEnd(maxRouteNameLength))} ${chalk.whiteBright(urlPath)}`)
  }
}

printRoutes()
