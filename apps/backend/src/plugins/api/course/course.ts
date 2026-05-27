import type { FastifyZodPluginCallback } from '#api/types'
import getCourseBySlug from './course-handler.js'

const course: FastifyZodPluginCallback = function (app, _opts, done) {
  const p = app.diContainer.resolve('makePathFunc')(app.prefix)

  app.get(p('api:course'), { schema: getCourseBySlug.schema }, getCourseBySlug.handler)

  done()
}

export default course
