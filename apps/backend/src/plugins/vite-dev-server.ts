import path from 'node:path'

import fastifyPlugin from 'fastify-plugin'
import { createServer as viteCreateServer } from 'vite'
import type { FastifyPluginAsync } from 'fastify'

import { devCerts } from '#utils'

// Taken from: github.com/royalswe/vike-fastify-boilerplate/blob/main/server/index.ts
const viteDevServerPlugin: FastifyPluginAsync = async function (app) {
  const config = app.diContainer.resolve('config')

  const viteServer = await viteCreateServer({
    root: path.join(config.rootDir, 'packages', 'ui', 'frontend'),
    server: {
      ...(await devCerts()),
      middlewareMode: true,
      hmr: {
        protocol: 'wss',
        clientPort: 24_032,
        port: 24_032,
      },
    },
  })

  app.addHook('onRequest', async (request, reply) => {
    const next = () =>
      new Promise<void>((resolve) => {
        viteServer.middlewares(request.raw, reply.raw, resolve)
      })
    await next()
  })
}

const viteDevServer = fastifyPlugin(viteDevServerPlugin, { name: 'vite-dev-server' })

export default viteDevServer
