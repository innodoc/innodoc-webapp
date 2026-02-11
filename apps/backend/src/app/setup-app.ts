import path from 'node:path'

import autoLoad from '@fastify/autoload'
import fastify from 'fastify'

import container from '@innodoc/container'

import { getRootDirPath } from '#utils'

async function setupApp() {
  const config = container.resolve('config')

  // Initialize fastify in env
  const env = await (config.isProduction ? import('./prod.js') : import('./dev.js'))
  const app = fastify(await env.options())
  await app.register(env.default)

  // Register services
  await app.register(autoLoad, {
    dir: path.join(getRootDirPath(), 'services'),
    dirNameRoutePrefix: false,
    forceESM: true,
    // auto-load files: `MODULE/MODULE.ts`
    matchFilter: (path) => /^\/(\w+)\/\1\.js$/.test(path),
  })

  return app
}

export default setupApp
