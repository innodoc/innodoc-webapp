import type { ApiRouteName } from '@innodoc/routes/types/routeNames'

import { getRoutePath } from '#utils'
import type { FastifyZodPluginCallback } from '#services/api/types'

import getFragmentContent from './fragment-content-handler.js'

const fragment: FastifyZodPluginCallback = function (app, opts, done) {
  const p = (name: ApiRouteName) => getRoutePath(name, app.prefix)

  app.get(p('api:course:fragment:content'), { schema: getFragmentContent.schema }, getFragmentContent.handler)

  done()
}

export default fragment
