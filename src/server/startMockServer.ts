import { makeServer } from '../../tests/mocks/node'

import config from './config'
import createServer from './createServer'

function startApiMockServer() {
  makeServer(config.appRoot).listen({ onUnhandledRequest: 'error' })

  createServer()
    .then(() => {
      console.log(`Server (with Mock API) running at http://${config.host}:${config.port}`)
      return undefined
    })
    .catch((error) => {
      console.error(error)
      process.exit(-1)
    })
}

void startApiMockServer()
