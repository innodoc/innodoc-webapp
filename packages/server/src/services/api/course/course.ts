import type { ApiRouteName } from '@innodoc/routes/types'

import { getRoutePath } from '#utils'
import type { FastifyZodPluginCallback } from '#services/api/types'

import getCourseBySlug from './getCourseBySlug'

const course: FastifyZodPluginCallback = function (app, opts, done) {
  const p = (name: ApiRouteName) => getRoutePath(name, app.prefix)
  app.get(p('api:course'), { schema: getCourseBySlug.schema }, getCourseBySlug.handler)
  done()
}

export default course
