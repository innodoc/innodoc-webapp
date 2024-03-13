import type { ApiRouteName } from '@innodoc/routes/types/routeNames'

import { getRoutePath } from '#utils'
import type { FastifyZodPluginCallback } from '#services/api/types'

import getSectionContent from './getSectionContent.js'
import getSections from './getSections.js'

const section: FastifyZodPluginCallback = function (app, opts, done) {
  const p = (name: ApiRouteName) => getRoutePath(name, app.prefix)

  app.get(p('api:course:sections'), { schema: getSections.schema }, getSections.handler)
  app.get(p('api:course:section:content'), { schema: getSectionContent.schema }, getSectionContent.handler)

  done()
}

export default section
