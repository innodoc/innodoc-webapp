import type { FastifyZodPluginCallback } from '#api/types'
import getSectionContent from './section-content-handler.js'
import getSections from './sections-handler.js'

const section: FastifyZodPluginCallback = function (app, _opts, done) {
  const p = app.diContainer.resolve('makePathFunc')(app.prefix)

  app.get(p('api:course:sections'), { schema: getSections.schema }, getSections.handler)
  app.get(p('api:course:section:content'), { schema: getSectionContent.schema }, getSectionContent.handler)

  done()
}

export default section
