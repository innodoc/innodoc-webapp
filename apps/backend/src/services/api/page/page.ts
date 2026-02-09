import type { ApiRouteName } from '@innodoc/routes/types/routeNames'

import { getRoutePath } from '#utils'
import type { FastifyZodPluginCallback } from '#services/api/types'

import getPageContent from './getPageContent.js'
import getPages from './getPages.js'

const page: FastifyZodPluginCallback = function (app, opts, done) {
  const p = (name: ApiRouteName) => getRoutePath(name, app.prefix)

  app.get(p('api:course:pages'), { schema: getPages.schema }, getPages.handler)
  app.get(p('api:course:page:content'), { schema: getPageContent.schema }, getPageContent.handler)

  done()
}

export default page
