/* eslint-disable no-console */

import path from 'path'
import startServer from './startServer'

const rootDir = path.resolve(__dirname, '..', '..', '..')

startServer(rootDir).then(
  ({ port, nodeEnv }) => {
    console.info(`Started ${nodeEnv} server on port ${port}.`)
  },
  (error) => {
    console.error(error)
    process.exit(1)
  }
)
