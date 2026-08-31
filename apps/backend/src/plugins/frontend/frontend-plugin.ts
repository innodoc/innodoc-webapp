import type { FastifyPluginAsync } from 'fastify'
import fastifyStatic from '@fastify/static'
import { asFunction } from 'awilix'
import fastifyPlugin from 'fastify-plugin'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { ServerEntryModule } from '@innodoc/frontend'
import makeStore from '@innodoc/shared-store/ssr'
import { FRONTEND_PATH } from '#constants'
import type { PluginOpts } from '#plugins/types'
import makeFrontendHandler from './handler.js'

const frontendPluginCb: FastifyPluginAsync<PluginOpts> = async (server, { config }) => {
  // Register per-request DI scope for Redux store
  server.addHook('onRequest', (request, reply, done) => {
    request.diScope.register({ store: asFunction(makeStore).scoped() })
    done()
  })

  // Production
  if (config.isProduction) {
    const distPath = path.join(FRONTEND_PATH, 'dist')

    // Serve static assets. With wildcard: false, @fastify/static registers
    // explicit routes for the built files only (and no index route, since
    // index: false), so '/' and all app routes fall through to the
    // not-found handler below and are SSR'd. The server build output is
    // ignored so the SSR bundle is never served to browsers.
    await server.register(fastifyStatic, {
      root: distPath,
      prefix: '/',
      wildcard: false,
      index: false,
      globIgnore: ['server/**'],
      decorateReply: false,
    })

    const { default: render } = (await import('@innodoc/frontend')) as ServerEntryModule
    const htmlTemplate = await fs.readFile(path.join(distPath, 'index.html'), 'utf8')
    const handler = makeFrontendHandler(render, htmlTemplate)

    // App routes (anything that isn't a static file) are server-side rendered
    server.setNotFoundHandler((request, reply) => handler.call(server, request, reply))
  }

  // Development
  else {
    // Dev-only: dynamically imported so the devDependencies are never loaded in production
    const viteDevServerModule = await import('./vite-dev-server.js')
    await server.register(viteDevServerModule.default)
    const { viteDevServer } = server

    server.get('/*', async (request, reply) => {
      // Load the SSR entry module via Vite's ssrLoadModule (HMR aware)
      const { default: render } = (await viteDevServer.ssrLoadModule('entry-server.tsx')) as ServerEntryModule

      const htmlTemplate = await fs.readFile(path.join(FRONTEND_PATH, 'src', 'index.html'), 'utf8')
      const transformedHtmlTemplate = await viteDevServer.transformIndexHtml(request.url, htmlTemplate)
      const handler = makeFrontendHandler(render, transformedHtmlTemplate)

      // The result must be returned rather than awaited and discarded: the handler resolves to the
      // reply it has already sent, which is what tells Fastify not to finalize the response itself.
      return handler.call(server, request, reply)
    })
  }
}

const frontendPlugin = fastifyPlugin(frontendPluginCb, { name: 'frontend' })

export default frontendPlugin
