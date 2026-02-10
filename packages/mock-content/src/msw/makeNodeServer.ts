// eslint-disable-next-line import/no-unresolved
import { setupServer } from 'msw/node' // https://github.com/mswjs/msw/issues/1786

import config from '@innodoc/config'
// import getRouteManager from '@innodoc/routes/node/getRouteManager'

import getHandlers from './getHandlers'

const makeNodeServer = (baseUrl: string) => {
  // FIXME: node/getRouteManager ??
  //  const handlers = getHandlers(baseUrl, getRouteManager(config))
  //  const server = setupServer(...handlers)
  //  return server
}

export default makeNodeServer
