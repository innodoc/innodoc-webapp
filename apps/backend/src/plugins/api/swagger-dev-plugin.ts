import type { FastifyPluginAsync } from 'fastify'
import fastifySwagger from '@fastify/swagger'
import scalarFastifyApiReference from '@scalar/fastify-api-reference'
import fastifyPlugin from 'fastify-plugin'
import { jsonSchemaTransform } from 'fastify-type-provider-zod'
// `#` subpath aliases cannot point outside the backend package (Node rejects `..` targets in
// the `imports` field), so the root package.json is imported relatively to source the version
import rootPackageJson from '../../../../../package.json' with { type: 'json' }

const swaggerPluginCb: FastifyPluginAsync = async (server) => {
  await server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'innoDoc API',
        description: 'innoDoc backend service',
        version: rootPackageJson.version,
      },
      servers: [],
    },
    transform: jsonSchemaTransform,
  })

  await server.register(scalarFastifyApiReference, { routePrefix: '/api-reference' })
}

const swaggerPlugin = fastifyPlugin(swaggerPluginCb, { name: 'swagger' })

export default swaggerPlugin
