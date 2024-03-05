import ISO6391 from 'iso-639-1'
import type { Knex } from 'knex'

export async function up(knex: Knex) {
  const values = ISO6391.getAllCodes().join("', '")
  await knex.schema.raw(`create type locale as enum ('${values}')`)
}

export async function down(knex: Knex) {
  await knex.schema.raw('drop type locale')
}
