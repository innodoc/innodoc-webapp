import knex, { type Knex } from 'knex'

import knexConfig from './knexConfig'

let connection: Knex

/** knex database instance singleton factory */
function getDatabase() {
  if (connection === undefined) {
    connection = knex(knexConfig)
  }

  return connection
}

export default getDatabase
