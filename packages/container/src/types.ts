import type RouteManager from '@innodoc/routes'
import type { ConfigSchema } from '@innodoc/schema/config'

interface ContainerModules {
  config: ConfigSchema
  routeManager: RouteManager
}

export type { ContainerModules }
