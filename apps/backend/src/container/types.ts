import type RouteManager from '@innodoc/shared-core/routes'
import type { ConfigSchema } from '@innodoc/shared-core/schemas/config'

interface ContainerModules {
  config: ConfigSchema
  routeManager: RouteManager
}

export type { ContainerModules }
