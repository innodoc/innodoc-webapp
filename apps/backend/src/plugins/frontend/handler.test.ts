import { diContainer, fastifyAwilixPlugin } from '@fastify/awilix'
import { asClass, asFunction, asValue } from 'awilix'
import Fastify, { type FastifyInstance } from 'fastify'
import path from 'node:path'
import { PassThrough } from 'node:stream'
import { afterAll, beforeAll, expect, test, vi } from 'vitest'
import type { RenderFunction } from '@innodoc/frontend'
import { RouteManager } from '@innodoc/shared-core/routes'
import { configSchema } from '@innodoc/shared-core/schemas'
import makeStore from '@innodoc/shared-store/ssr'
import MockDatabase from '#plugins/api/mock-database'
import i18nPlugin from '#plugins/i18n-plugin'
import makeFrontendHandler from './handler.js'

// The SSR handler parses the URL with the same RouteManager the client navigates with. These
// requests pin that a URL whose locale is outside the ISO 639-1 domain is not a route: the handler
// answers the app's 404 instead of rendering a document with the bogus locale, while a valid
// locale still renders in the language of the URL.
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

// Stands in for the frontend SSR entry. The 404 answers never reach it; for valid routes it
// records what the handler resolved as the document locale. The stream is a `PassThrough`, like
// the real entry's, and is ended immediately: it stays empty, and the assertions concern the
// status and the resolved locale.
const render = vi.fn<RenderFunction>(() => {
  const stream = new PassThrough()
  stream.end()

  return { status: Promise.resolve(200), stream }
})

let server: FastifyInstance

beforeAll(async () => {
  diContainer.register({
    config: asValue(config),
    database: asValue(new MockDatabase({ config })),
    routeManager: asClass(RouteManager).singleton(),
  })

  server = Fastify()
  await server.register(fastifyAwilixPlugin)
  await server.register(i18nPlugin, { config })

  // Per-request Redux store, as in the frontend plugin
  server.addHook('onRequest', (request, reply, done) => {
    request.diScope.register({ store: asFunction(makeStore).scoped() })
    done()
  })

  const handler = makeFrontendHandler(render, '<!doctype html><html><head></head><body></body></html>')
  server.get('/*', (request, reply) => handler.call(server, request, reply))
  await server.ready()
})

afterAll(async () => {
  await server.close()
})

test('a URL locale outside the ISO 639-1 domain answers the app 404 without rendering', async () => {
  const response = await server.inject({ method: 'GET', url: '/xx/user/login' })

  expect(response.statusCode).toBe(404)
  expect(response.payload).toContain('404 - Not Found')
  expect(render).not.toHaveBeenCalled()
})

test('a locale-like segment that is not a two-letter code answers the app 404 without rendering', async () => {
  const response = await server.inject({ method: 'GET', url: '/en-US/user/login' })

  expect(response.statusCode).toBe(404)
  expect(render).not.toHaveBeenCalled()
})

test('a valid locale still renders, in the locale of the URL', async () => {
  const response = await server.inject({ method: 'GET', url: '/en/user/login' })

  expect(response.statusCode).toBe(200)
  expect(render).toHaveBeenCalledTimes(1)
  expect(render).toHaveBeenCalledWith(expect.objectContaining({ locale: 'en', url: '/en/user/login' }))
})
