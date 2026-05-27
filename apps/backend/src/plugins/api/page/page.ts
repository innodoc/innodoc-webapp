import type { FastifyZodPluginCallback } from '#api/types'
import getPageContent from './page-content-handler.js'
import getPages from './pages-handler.js'

const page: FastifyZodPluginCallback = function (app, _opts, done) {
  const p = app.diContainer.resolve('makePathFunc')(app.prefix)

  app.get(p('api:course:pages'), { schema: getPages.schema }, getPages.handler)
  app.get(p('api:course:page:content'), { schema: getPageContent.schema }, getPageContent.handler)

  done()
}

export default page
