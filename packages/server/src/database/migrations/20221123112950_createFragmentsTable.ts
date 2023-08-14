import type { Knex } from 'knex'

import { FRAGMENT_TYPES } from '@innodoc/constants'

export async function up(knex: Knex) {
  // fragment enum type

  const values = FRAGMENT_TYPES.join("', '")
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
    t.integer('fragment_id')
      .notNullable()
      .references('fragments.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    t.text('value').notNullable()
    t.enum('locale', null, {
      enumName: 'locale',
      existingType: true,
      useNative: true,
    }).notNullable()
    t.unique(['fragment_id', 'locale'])
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('fragments_content_trans')
  await knex.schema.dropTable('fragments')
  await knex.schema.raw('drop type fragment_type')
}