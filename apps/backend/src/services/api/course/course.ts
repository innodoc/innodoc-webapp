import type { ApiRouteName } from '@innodoc/shared-core/routes'

import { getRoutePath } from '#utils'
import type { FastifyZodPluginCallback } from '#services/api/types'

import getCourseBySlug from './course-handler.js'

const course: FastifyZodPluginCallback = function (app, opts, done) {
  const p = (name: ApiRouteName) => getRoutePath(name, app.prefix)
  app.get(p('api:course'), { schema: getCourseBySlug.schema }, getCourseBySlug.handler)
  done()
}

export default course
