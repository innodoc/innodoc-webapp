import type ServerConfig from '@innodoc/types/server-config'

import RouteManager from './RouteManager'

/** Return `RouteManager` instance (Node.js) */
function getRouteManagerNode(config: ServerConfig) {
  return RouteManager.getInstance(
    config.courseSlugMode,
    config.pagePathPrefix,
    config.sectionPathPrefix
  )
}

export default getRouteManagerNode
