// eslint-disable-next-line import/no-unresolved
import { setupWorker } from 'msw/browser' // https://github.com/mswjs/msw/issues/1877

import getRouteManager from 'innodoc/shared-core/routes/manager'

import getHandlers from './get-handlers'

const makeBrowserServer = (baseUrl: string) => setupWorker(...getHandlers(baseUrl, getRouteManager()))

export default makeBrowserServer
