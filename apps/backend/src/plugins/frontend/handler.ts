import type { RouteHandlerMethod } from 'fastify'
import type { RenderFunction } from '@innodoc/frontend'

/**
 * Create the SSR route handler.
 *
 * @param render - SSR render function (from frontend server entry)
 * @param htmlTemplate - HTML template
 */
function makeFrontendHandler(render: RenderFunction, htmlTemplate: string): RouteHandlerMethod {
  return async ({ diScope, i18n, url }, reply) => {
    const routeManager = diScope.resolve('routeManager')
    const store = diScope.resolve('store')

    const stream = render({ htmlTemplate, i18n, routeManager, store, url })
    reply.type('text/html')
    reply.send(stream)
  }
}

export default makeFrontendHandler
