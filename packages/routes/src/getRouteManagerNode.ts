import type { ConfigSchema } from '@innodoc/schema/config'

import RouteManager from './RouteManager'

type RouteManagerConfigSchema = Pick<
  ConfigSchema,
  'courseSlugMode' | 'pagePathPrefix' | 'sectionPathPrefix'
>

/** Return `RouteManager` instance (Node.js) */
function getRouteManagerNode(config: RouteManagerConfigSchema) {
  return RouteManager.getInstance(
    config.courseSlugMode,
    config.pagePathPrefix,
    config.sectionPathPrefix,
  )
}

export default getRouteManagerNode
