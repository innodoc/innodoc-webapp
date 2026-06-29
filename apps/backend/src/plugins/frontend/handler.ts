import type { RouteHandlerMethod } from 'fastify'
import type { RenderFunction } from '@innodoc/frontend'
import { populateStoreForSSR } from '@innodoc/frontend/populate-store'
import type Database from '@innodoc/server-db'
import type { RouteManager } from '@innodoc/shared-core/routes'

/**
 * Create the SSR route handler.
 *
 * @param render - SSR render function (from frontend server entry)
 * @param htmlTemplate - HTML template
 */
function makeFrontendHandler(render: RenderFunction, htmlTemplate: string): RouteHandlerMethod {
  return async ({ diScope, i18n, url }, reply) => {
    const routeManager: RouteManager = diScope.resolve('routeManager')
    const store = diScope.resolve('store')
    const database: Database = diScope.resolve('database')

    // Parse URL to extract route info
    const routeInfo = routeManager.parseRouteFromUrl(url)

    if (!routeInfo) {
      // No matching route - return 404
      reply.status(404).type('text/html')
      reply.send('<h1>404 - Not Found</h1>')
      return
    }

    // Populate store with data for this route (using direct DB calls)
    const populateResult = await populateStoreForSSR({
      store,
      routeInfo,
      routeManager,
      database,
    })

    // Handle redirect
    if (populateResult.redirect) {
      reply.status(populateResult.redirect.statusCode)
      reply.redirect(populateResult.redirect.url)
      return
    }

    // Handle error
    if (!populateResult.success) {
      reply.status(404).type('text/html')
      reply.send(`<h1>404 - ${populateResult.error?.message}</h1>`)
      return
    }

    // Render with populated store
    const stream = render({ htmlTemplate, i18n, routeManager, store, url })
    reply.type('text/html')
    reply.send(stream)
  }
}

export default makeFrontendHandler
