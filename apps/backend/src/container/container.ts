import * as awilix from 'awilix'

import parseConfig from '@innodoc/server-env'
import RouteManager from '@innodoc/shared-core/routes'

import type { ContainerModules } from './types.js'

const container = awilix.createContainer<ContainerModules>({
  injectionMode: awilix.InjectionMode.PROXY,
  strict: true,
})

container.register({
  config: awilix.asFunction(parseConfig).singleton(),
  routeManager: awilix.asClass(RouteManager).singleton(),
})

export default container
