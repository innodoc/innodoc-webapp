import { setupWorker } from 'msw/browser'
import getRouteManager from '@innodoc/shared-core/routes/manager/vite'
import getHandlers from './get-handlers'

const makeBrowserServer = (baseUrl: string) => setupWorker(...getHandlers(baseUrl, getRouteManager()))

export default makeBrowserServer
