import type Database from '@innodoc/server-db'
import type { RouteManager } from '@innodoc/shared-core/routes'
import type { ConfigSchema } from '@innodoc/shared-core/types'

import type { makePathFunc } from './di-container.js'

declare module '@fastify/awilix' {
  interface Cradle {
    config: ConfigSchema
    database: Database
    routeManager: RouteManager
    makePathFunc: ReturnType<typeof makePathFunc>
  }
}
