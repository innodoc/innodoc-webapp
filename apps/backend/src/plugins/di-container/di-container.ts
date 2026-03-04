import { diContainer, fastifyAwilixPlugin } from '@fastify/awilix'
import { asClass, asFunction, asValue } from 'awilix'
import fastifyPlugin from 'fastify-plugin'
import type { FastifyPluginCallback } from 'fastify'

import Database from '@innodoc/server-db'
import { RouteManager } from '@innodoc/shared-core/routes'
import type { ApiRouteName, ConfigSchema } from '@innodoc/shared-core/types'

import { getRoutePath } from '#utils'

interface DiContainerPluginOpts {
  config: ConfigSchema
}

const diContainerPluginCb: FastifyPluginCallback<DiContainerPluginOpts> = (app, { config }) => {
  app.register(fastifyAwilixPlugin)
  setupDiContainer(config)
}

const diContainerPlugin = fastifyPlugin(diContainerPluginCb, { name: 'di-container' })

interface MakePathFuncParams {
  routeManager: RouteManager
}

/** Make a path function for plugins. */
function makePathFunc({ routeManager }: MakePathFuncParams) {
  return (appPrefix?: string) => (name: ApiRouteName) => getRoutePath(routeManager, name, appPrefix)
}

function setupDiContainer(config: ConfigSchema) {
  diContainer.register({
    config: asValue(config),

    database: asClass(Database)
      .singleton()
      .disposer((db) => db.destroy()),

    routeManager: asClass(RouteManager).singleton(),

    makePathFunc: asFunction(makePathFunc).singleton(),
  })
}

export type { makePathFunc }
export default diContainerPlugin
