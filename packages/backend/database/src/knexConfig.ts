import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Knex } from 'knex'

import config from '@innodoc/config'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const knexConfig: Knex.Config = {
  asyncStackTraces: !config.isProduction,
  client: 'pg',
  connection: config.dbConnectionString,
  debug: config.dbDebug,
  pool: { min: 0, max: 7 },
  migrations: {
    extension: 'ts',
    directory: path.join(dirname, 'migrations'),
    loadExtensions: ['.ts'],
    tableName: 'migrations',
  },
}

export default knexConfig
