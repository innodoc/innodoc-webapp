import path from 'node:path'

import type { Knex } from 'knex'

import getConfig from '@innodoc/server-env'
import type { ConfigSchema } from '@innodoc/shared-core/types'

function makeKnexConfig(configIn?: ConfigSchema) {
  const config = configIn ?? getConfig()

  return {
    asyncStackTraces: !config.isProduction,
    client: 'pg',
    connection: config.dbConnectionString,
    debug: config.dbDebug,
    pool: { min: 0, max: 7 },
    migrations: {
      extension: 'ts',
      directory: path.join(import.meta.dirname, 'migrations'),
      loadExtensions: ['.ts'],
      tableName: 'migrations',
    },
  } satisfies Knex.Config
}

export default makeKnexConfig
