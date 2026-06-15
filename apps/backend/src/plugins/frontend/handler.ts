import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { RenderFunction } from '@innodoc/frontend'

/**
 * Create the SSR route handler and register a catch-all route on the Fastify server.
 *
 * @param server - Fastify server instance
 * @param render - SSR render function (from frontend server entry)
 * @param htmlTemplate - HTML template
 */
function makeFrontendHandler(server: FastifyInstance, render: RenderFunction, htmlTemplate: string) {
  return async ({ diScope, i18n, url }: FastifyRequest, reply: FastifyReply) => {
    const routeManager = diScope.resolve('routeManager')
    const store = diScope.resolve('store')

    const stream = render({ htmlTemplate, i18n, routeManager, store, url })
    reply.type('text/html')
    reply.send(stream)
  }
}

export default makeFrontendHandler
