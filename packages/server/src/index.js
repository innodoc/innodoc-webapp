/* eslint-disable no-console */

import createExpressApp from './createExpressApp'
import createNextApp from './createNextApp'
import connectDb from './db'
import getConfig from './getConfig'

const startServer = async () => {
  try {
    const config = getConfig()
    const nextApp = await createNextApp(config)
    await connectDb(config)
    const expressApp = createExpressApp(config, nextApp)
    await expressApp.listen(config.port, config.host)
    console.info(`Started ${config.nodeEnv} server on port ${config.port}.`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

if (require.main === module) {
  startServer()
}

export default startServer
