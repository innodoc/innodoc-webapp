import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

import type { Knex } from 'knex'

import config from '#server/config'

const knexConfig: Knex.Config = {
  asyncStackTraces: !config.isProduction,
  client: 'pg',
  connection: config.dbConnection,
  debug: config.dbDebug,
  pool: { min: 0, max: 7 },
  migrations: {
    directory: path.resolve(__dirname, 'migrations'),
    tableName: 'migrations',
  },
  seeds: {
    directory: path.resolve(__dirname, 'seeds'),
  },
}

export default knexConfig
