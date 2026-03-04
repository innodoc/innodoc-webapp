import fastifyStatic from '@fastify/static'
import fastifyPlugin from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'

const options = () =>
  Promise.resolve({
    http2: true,
    logger: false,
  })

const prodPlugin: FastifyPluginAsync = async function (app) {
  const config = app.diContainer.resolve('config')

  // In production, we need to serve our static assets ourselves.
  await app.register(fastifyStatic, {
    root: config.distDir,
    wildcard: false,
  })
}

const prod = fastifyPlugin(prodPlugin, { name: 'prod' })

export { options }
export default prod
