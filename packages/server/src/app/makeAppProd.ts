import fastifyStatic from '@fastify/static'
import fastify from 'fastify'

import config from '@innodoc/config'

const options = {
  http2: true,
  logger: false,
}

async function makeAppProd() {
  const app = fastify(options)

  // In production, we need to serve our static assets ourselves.
  await app.register(fastifyStatic, {
    root: config.distDir,
    wildcard: false,
  })

  return app
}

export default makeAppProd
