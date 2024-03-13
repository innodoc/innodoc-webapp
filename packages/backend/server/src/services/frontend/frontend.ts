import fastifyAccepts from '@fastify/accepts'
import type { FastifyPluginAsync } from 'fastify'

import frontendHandler from './frontendHandler.js'

const autoPrefix = '/'

const frontend: FastifyPluginAsync = async function (app) {
  await app.register(fastifyAccepts)
  app.get('*', frontendHandler)
}

export { autoPrefix }
export default frontend
