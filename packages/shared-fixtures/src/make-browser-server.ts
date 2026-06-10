import { setupWorker } from 'msw/browser'
import type { RouteManager } from '@innodoc/shared-core/routes'
import getHandlers from './get-handlers'

// TODO: How to get config here?
// const makeBrowserServer = (baseUrl: string) => setupWorker(...getHandlers(baseUrl, new RouteManager()))
const makeBrowserServer = (baseUrl: string) =>
  setupWorker(...getHandlers(baseUrl, undefined as unknown as RouteManager))

export default makeBrowserServer
