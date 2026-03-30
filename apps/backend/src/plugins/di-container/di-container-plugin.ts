import { diContainer, fastifyAwilixPlugin } from '@fastify/awilix'
import { asClass, asFunction, asValue } from 'awilix'
import fastifyPlugin from 'fastify-plugin'
import type { FastifyPluginCallback } from 'fastify'

import Database from '@innodoc/server-db'
import { RouteManager } from '@innodoc/shared-core/routes'
import type { ConfigSchema, FrontendRouteName } from '@innodoc/shared-core/types'

import { getRoutePath } from '#utils'
import type { PluginOpts } from '#plugins/types'

const diContainerPluginCb: FastifyPluginCallback<PluginOpts> = (server, { config }) => {
  server.register(fastifyAwilixPlugin, { enableDebugLogging: !config.isProduction })
  setupDiContainer(config)
}

const diContainerPlugin = fastifyPlugin(diContainerPluginCb, { name: 'di-container' })

interface MakePathFuncParams {
  routeManager: RouteManager
}

/** Make a path function for plugins. */
function makePathFunc({ routeManager }: MakePathFuncParams) {
  return (removePrefix?: string) => (name: FrontendRouteName) => getRoutePath(routeManager, name, removePrefix)
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
