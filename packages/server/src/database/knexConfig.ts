import path from 'path'
import type { Knex } from 'knex'

import config from '#config'

const knexConfig: Knex.Config = {
  asyncStackTraces: !config.isProduction,
  client: 'pg',
  connection: config.dbConnection,
  debug: config.dbDebug,
  pool: { min: 0, max: 7 },
  migrations: {
    directory: path.join(config.rootDir, 'packages', 'server', 'src', 'database', 'migrations'),
    tableName: 'migrations',
  },
}

export default knexConfig
