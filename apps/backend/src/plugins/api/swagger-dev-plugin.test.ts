import { diContainer, fastifyAwilixPlugin } from '@fastify/awilix'
import { asClass, asFunction, asValue } from 'awilix'
import Fastify, { type FastifyInstance } from 'fastify'
import path from 'node:path'
import { afterAll, beforeAll, expect, test } from 'vitest'
import { RouteManager } from '@innodoc/shared-core/routes'
import { configSchema } from '@innodoc/shared-core/schemas'
import type { RouteName } from '@innodoc/shared-core/types'
import { getRoutePath } from '#utils'
// Compared against the same root package.json the plugin sources its version from (a `#`
// subpath alias cannot point outside the backend package, see swagger-dev-plugin.ts)
import rootPackageJson from '../../../../../package.json' with { type: 'json' }
import apiPlugin from './api-plugin.js'
import MockDatabase from './mock-database.js'

// In dev mode (isProduction: false) the API plugin registers the swagger plugin, so the served
// OpenAPI spec is exercised the same way the dev server serves it.
const config = configSchema.parse({
  isProduction: false,
  rootDir: process.cwd(),
  distDir: path.join(process.cwd(), 'dist'),
  jwtSecret: 'test-jwt-secret',
  dbConnectionString: 'postgresql://localhost:5432/test',
  smtpHost: 'localhost',
  smtpPort: 25,
  smtpUser: 'test-user',
  smtpPassword: 'test-password',
  smtpSender: 'test@example.com',
  courseSlugMode: 'URL',
  defaultCourseSlug: null,
  discourseUrl: null,
  discourseSsoSecret: null,
})

let server: FastifyInstance

beforeAll(async () => {
  diContainer.register({
    config: asValue(config),
    database: asValue(new MockDatabase({ config })),
    routeManager: asClass(RouteManager).singleton(),
    makePathFunc: asFunction(
      ({ routeManager }: { routeManager: RouteManager }) =>
        (removePrefix?: string) =>
        (name: RouteName) =>
          getRoutePath(routeManager, name, removePrefix),
    ).singleton(),
  })

  server = Fastify()
  await server.register(fastifyAwilixPlugin)
  await server.register(apiPlugin)
  await server.ready()
})

afterAll(async () => {
  await server.close()
})

test('the dev OpenAPI spec reports the version from the root package.json', async () => {
  const response = await server.inject({ method: 'GET', url: '/api-reference/openapi.json' })

  expect(response.statusCode).toBe(200)
  expect(JSON.parse(response.payload)).toMatchObject({ info: { version: rootPackageJson.version } })
})
