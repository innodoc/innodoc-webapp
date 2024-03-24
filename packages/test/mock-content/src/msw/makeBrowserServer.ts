// eslint-disable-next-line import/no-unresolved
import { setupWorker } from 'msw/browser' // https://github.com/mswjs/msw/issues/1877

import getRouteManager from '@innodoc/routes/vite/getRouteManager'

import getHandlers from './getHandlers'

const makeBrowserServer = (baseUrl: string) => setupWorker(...getHandlers(baseUrl, getRouteManager()))

export default makeBrowserServer
