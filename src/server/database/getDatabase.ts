import knex, { type Knex } from 'knex'

import knexConfig from './knexConfig'

let connection: Knex

function getDatabase() {
  if (connection === undefined) {
    connection = knex(knexConfig)
  }

  return connection
}

export default getDatabase
