import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Knex } from 'knex'

// TODO: how to pass config?
import container from '../../../apps/backend/src/container'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const config = container.resolve('config')

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
