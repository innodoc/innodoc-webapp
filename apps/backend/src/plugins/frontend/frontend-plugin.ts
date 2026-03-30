import fs from 'node:fs/promises'
import path from 'node:path'

import fastifyStatic from '@fastify/static'
import { asFunction } from 'awilix'
import fastifyPlugin from 'fastify-plugin'
import type { FastifyPluginAsync, RouteHandlerMethod } from 'fastify'

import makeStore from '@innodoc/ui-store'
import type { RenderFunction, ServerEntryModule } from '@innodoc/frontend'

import { FRONTEND_PATH } from '#constants'
import type { PluginOpts } from '#plugins/types'

/**
 * Create the SSR route handler.
 *
 * @param render - SSR render function (from frontend server entry)
 * @param htmlTemplate - HTML template
 */
function makeFrontendHandler(render: RenderFunction, htmlTemplate: string): RouteHandlerMethod {
  return async ({ diScope, i18n, url }, reply) => {
    const routeManager = diScope.resolve('routeManager')
    const store = await diScope.resolve('store')

    const stream = render({ htmlTemplate, i18n, routeManager, store, url })
    reply.type('text/html')
    reply.send(stream)
  }
}

const frontendPluginCb: FastifyPluginAsync<PluginOpts> = async (server, { config }) => {
  // Register per-request DI scope for Redux store
  server.addHook('onRequest', (request, reply, done) => {
    request.diScope.register({
      store: asFunction(makeStore)
        .inject(() => ({
          devTools: !config.isProduction,
          isSsr: true,
          preloadedState: undefined,
        }))
        .scoped(),
    })

    done()
  })

  // Production
  if (config.isProduction) {
    const distPath = path.join(FRONTEND_PATH, 'dist')

    // Serve static assets
    await server.register(fastifyStatic, {
      root: distPath,
      prefix: '/',
      decorateReply: false,
    })

    const { default: render } = (await import('@innodoc/frontend')) as ServerEntryModule
    const htmlTemplate = await fs.readFile(path.join(distPath, 'index.html'), 'utf8')
    const handler = makeFrontendHandler(render, htmlTemplate)

    server.get('/*', handler)
  }

  // Development
  else {
    const viteDevServerModule = await import('./vite-dev-server.js')
    await server.register(viteDevServerModule.default)
    const { viteDevServer } = server

    server.get('/*', async (request, reply) => {
      // Load the SSR entry module via Vite's ssrLoadModule (HMR aware)
      const { default: render } = (await viteDevServer.ssrLoadModule('entry-server.tsx')) as ServerEntryModule

      const htmlTemplate = await fs.readFile(path.join(FRONTEND_PATH, 'src', 'index.html'), 'utf8')
      const transformedHtmlTemplate = await viteDevServer.transformIndexHtml(request.url, htmlTemplate)
      const handler = makeFrontendHandler(render, transformedHtmlTemplate)

      await handler.call(server, request, reply)
    })
  }
}

const frontendPlugin = fastifyPlugin(frontendPluginCb, { name: 'frontend' })

export default frontendPlugin
