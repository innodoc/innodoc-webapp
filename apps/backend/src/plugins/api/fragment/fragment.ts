import type { FastifyZodPluginCallback } from '#api/types'
import getFragmentContent from './fragment-content-handler.js'

const fragment: FastifyZodPluginCallback = function (app, _opts, done) {
  const p = app.diContainer.resolve('makePathFunc')(app.prefix)

  app.get(p('api:course:fragment:content'), { schema: getFragmentContent.schema }, getFragmentContent.handler)

  done()
}

export default fragment
