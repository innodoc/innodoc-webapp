import path from 'node:path'

import autoLoad from '@fastify/autoload'
import fastify from 'fastify'

import config from '@innodoc/config'

import { getRootDirPath } from '#utils'

async function setupApp() {
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
    matchFilter: (path) => Boolean(/^\/(\w+)\/\1\.js$/.test(path)),
  })

  return app
}

export default setupApp
