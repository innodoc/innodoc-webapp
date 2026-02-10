#!/usr/bin/env node

import chalk from 'chalk'

import container from '@innodoc/container'

function printRoutes() {
  const routes = container.resolve('routeManager').getAllRoutes()

  const maxRouteNameLength = Math.max(...Object.keys(routes).map((routeName) => routeName.length))

  for (const [routeName, urlPath] of Object.entries(routes)) {
    console.log(`${chalk.blueBright(routeName.padEnd(maxRouteNameLength))} ${chalk.whiteBright(urlPath)}`)
  }
}

printRoutes()
