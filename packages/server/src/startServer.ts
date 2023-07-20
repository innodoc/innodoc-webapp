import config from './config'
import createServer from './createServer'

createServer()
  .then(() => {
    console.log(`Server running at http://${config.host}:${config.port}`)
    return undefined
  })
  .catch((error) => {
    console.error(error)
    process.exit(-1)
  })
