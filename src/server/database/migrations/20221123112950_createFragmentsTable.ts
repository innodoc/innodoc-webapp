import type { Knex } from 'knex'

import { CONTENT_FRAGMENT_TYPES } from '#constants'

export async function up(knex: Knex) {
  // fragment enum type

  const values = CONTENT_FRAGMENT_TYPES.join("', '")
  await knex.schema.raw(`create type fragment_type as enum ('${values}')`)

  // fragments table

  await knex.schema.createTable('fragments', (t) => {
    t.increments('id').primary()
    t.integer('course_id')
      .notNullable()
      .references('courses.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    t.enum('type', null, {
      enumName: 'fragment_type',
      existingType: true,
      useNative: true,
    }).notNullable()
    t.timestamp('created_at').defaultTo(knex.fn.now())
    t.timestamp('updated_at').defaultTo(knex.fn.now())
    t.unique(['course_id', 'type']) // unique per course
  })

  // Translations

  await knex.schema.createTable('fragments_content_trans', (t) => {
    t.integer('course_id')
      .notNullable()
      .references('courses.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    t.jsonb('value').notNullable().defaultTo(JSON.stringify({}))
    t.enum('locale', null, {
      enumName: 'locale',
      existingType: true,
      useNative: true,
    }).notNullable()
    t.unique(['course_id', 'locale'])
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('fragments_content_trans')
  await knex.schema.dropTable('fragments')
  await knex.schema.raw('drop type fragment_type')
}
