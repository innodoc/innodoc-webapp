import knex, { type Knex } from 'knex'

import knexConfig from './knexConfig'

let connection: Knex | undefined

/** knex database instance singleton factory */
function getDatabase() {
  if (connection === undefined) {
    connection = knex(knexConfig)
  }

  return connection
}

export default getDatabase
