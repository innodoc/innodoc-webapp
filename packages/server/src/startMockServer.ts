import config from '@innodoc/config'

import { makeServer } from '../../tests/mocks/node' // eslint-disable-line @typescript-eslint/no-restricted-imports
import setupApp from './app/setupApp'

// TODO
function startApiMockServer() {
  makeServer(config.appRoot).listen({ onUnhandledRequest: 'error' })

  createServer()
    .then(() => {
      console.log(`Server (with Mock API) running at http://${config.host}:${config.port}`)
      return
    })
    .catch((error) => {
      console.error(error)
      process.exit(-1)
    })
}

startApiMockServer()
