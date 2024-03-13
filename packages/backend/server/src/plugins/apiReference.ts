import fastifySwagger from '@fastify/swagger'
import scalarFastifyApiReference from '@scalar/fastify-api-reference'
import fastifyPlugin from 'fastify-plugin'
import { jsonSchemaTransform } from 'fastify-type-provider-zod'
import type { FastifyPluginAsync } from 'fastify'

const apiReferencePlugin: FastifyPluginAsync = async function (app) {
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'innoDoc API',
        description: 'innoDoc backend service',
        version: '1.0.0',
      },
      servers: [],
    },
    transform: jsonSchemaTransform,
  })

  await app.register(scalarFastifyApiReference, { routePrefix: '/api-reference' })
}

const apiReference = fastifyPlugin(apiReferencePlugin, { name: 'api-reference' })

export default apiReference
