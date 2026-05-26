import { setupServer } from 'msw/node'
import { RouteManager } from '@innodoc/shared-core/routes'
import type { ConfigSchema } from '@innodoc/shared-core/types'
import getHandlers from './get-handlers'

const makeNodeServer = (config: ConfigSchema) => {
  const routeManager = new RouteManager({ config })
  const handlers = getHandlers(config.appRoot, routeManager)
  return setupServer(...handlers)
}

export default makeNodeServer
