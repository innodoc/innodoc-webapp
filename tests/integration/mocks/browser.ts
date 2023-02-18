import { setupWorker } from 'msw'

import getHandlers from './getHandlers'

export default (baseUrl: string) => setupWorker(...getHandlers(baseUrl))
