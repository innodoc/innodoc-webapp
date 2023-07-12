import path from 'path'

import type { Knex } from 'knex'

import config from '#server/config'

const knexConfig: Knex.Config = {
  asyncStackTraces: !config.isProduction,
  client: 'pg',
  connection: config.dbConnection,
  debug: config.dbDebug,
  pool: { min: 0, max: 7 },
  migrations: {
    directory: path.join(config.rootDir, 'src', 'server', 'database', 'migrations'),
    tableName: 'migrations',
  },
}

export default knexConfig
