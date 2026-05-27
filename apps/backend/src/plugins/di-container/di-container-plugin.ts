import type { FastifyPluginCallback } from 'fastify'
import { diContainer, fastifyAwilixPlugin } from '@fastify/awilix'
import { asClass, asFunction, asValue } from 'awilix'
import fastifyPlugin from 'fastify-plugin'
import Database from '@innodoc/server-db'
import { RouteManager } from '@innodoc/shared-core/routes'
import type { ConfigSchema, RouteName } from '@innodoc/shared-core/types'
import type { PluginOpts } from '#plugins/types'
import { getRoutePath } from '#utils'

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
  return (removePrefix?: string) => (name: RouteName) => getRoutePath(routeManager, name, removePrefix)
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
