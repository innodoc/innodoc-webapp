import { diContainer, fastifyAwilixPlugin } from '@fastify/awilix'
import { asClass, asFunction, asValue } from 'awilix'
import Fastify, { type FastifyInstance } from 'fastify'
import path from 'node:path'
import { afterAll, beforeAll, expect, test } from 'vitest'
import { RouteManager } from '@innodoc/shared-core/routes'
import { configSchema } from '@innodoc/shared-core/schemas'
import type { RouteName } from '@innodoc/shared-core/types'
import { getRoutePath } from '#utils'
import apiPlugin from './api-plugin.js'
import MockDatabase from './mock-database.js'

// The content endpoints validate `locale` against the shared ISO 639-1 domain. These requests
// pin that a locale outside the domain is rejected at the API boundary (400) instead of
// reaching the database as a 404/500, while a valid locale still serves content.
const config = configSchema.parse({
  isProduction: true,
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

test('page content rejects a locale outside the ISO 639-1 domain with 400', async () => {
  const response = await server.inject({ method: 'GET', url: '/api/course/test-course/pages/en_US/home' })

  expect(response.statusCode).toBe(400)
  expect(JSON.parse(response.payload)).toMatchObject({ statusCode: 400, code: 'FST_ERR_VALIDATION' })
})

test('section content rejects a locale outside the ISO 639-1 domain with 400', async () => {
  const response = await server.inject({ method: 'GET', url: '/api/course/test-course/sections/en_US/section-1' })

  expect(response.statusCode).toBe(400)
  expect(JSON.parse(response.payload)).toMatchObject({ statusCode: 400, code: 'FST_ERR_VALIDATION' })
})

test('fragment content rejects a locale outside the ISO 639-1 domain with 400', async () => {
  const response = await server.inject({ method: 'GET', url: '/api/course/test-course/fragments/en_US/footer-a' })

  expect(response.statusCode).toBe(400)
  expect(JSON.parse(response.payload)).toMatchObject({ statusCode: 400, code: 'FST_ERR_VALIDATION' })
})

test('page content serves content for a valid locale', async () => {
  const response = await server.inject({ method: 'GET', url: '/api/course/test-course/pages/en/home' })

  expect(response.statusCode).toBe(200)
  expect(response.payload).toContain('start of the journey')
})
