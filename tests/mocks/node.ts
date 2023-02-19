import { fetch, Headers, Request, Response } from 'cross-fetch'
import { setupServer } from 'msw/node'

import getHandlers from './getHandlers'

// polyfill needed for msw to work
global.fetch = fetch
global.Headers = Headers
global.Request = Request
global.Response = Response

const makeServer = (baseUrl: string) => {
  const handlers = getHandlers(baseUrl)
  const server = setupServer(...handlers)
  return server
}

export { makeServer }
