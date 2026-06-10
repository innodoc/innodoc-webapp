import type { makePathFunc } from './di-container-plugin.js'
import type Database from '@innodoc/server-db'
import type { RouteManager } from '@innodoc/shared-core/routes'
import type { ConfigSchema } from '@innodoc/shared-core/types'
import type makeStore from '@innodoc/shared-store/ssr'

declare module '@fastify/awilix' {
  interface Cradle {
    config: ConfigSchema
    database: Database
    routeManager: RouteManager
    makePathFunc: ReturnType<typeof makePathFunc>
  }

  interface RequestCradle {
    store: ReturnType<typeof makeStore>
  }
}
