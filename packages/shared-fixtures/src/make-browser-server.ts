import { setupWorker } from 'msw/browser'
import getHandlers from './get-handlers'
import type { RouteManager } from '@innodoc/shared-core/routes'

// TODO: How to get config here?
// const makeBrowserServer = (baseUrl: string) => setupWorker(...getHandlers(baseUrl, new RouteManager()))
const makeBrowserServer = (baseUrl: string) => setupWorker(...getHandlers(baseUrl, undefined as unknown as RouteManager))

export default makeBrowserServer
