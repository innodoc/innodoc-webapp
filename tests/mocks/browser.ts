import { setupWorker } from 'msw'

import getRouteManager from '#routes/getRouteManager'

import getHandlers from './getHandlers'

export default (baseUrl: string) => setupWorker(...getHandlers(baseUrl, getRouteManager()))
