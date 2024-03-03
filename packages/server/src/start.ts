import config from '@innodoc/config'

import setupApp from './app/setupApp'

setupApp()
  .then((app) => {
    return app.listen({ host: config.host, port: config.port })
  })
  .catch((error) => {
    console.error(error)
    process.exit(-1)
  })
