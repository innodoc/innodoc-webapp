import type { Knex } from 'knex'

import { SECTION_TYPES, SLUG_RE_POSIX } from '@innodoc/constants'

export async function up(knex: Knex) {
  // section enum type

  const values = SECTION_TYPES.join("', '")
  await knex.schema.raw(`create type section_type as enum ('${values}')`)

  // sections table

  await knex.schema.createTable('sections', (t) => {
    t.increments('id').primary()
    t.string('slug').notNullable().checkRegex(`^${SLUG_RE_POSIX}$`)
    t.integer('course_id')
      .notNullable()
      .references('courses.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    t.enum('type', null, {
      enumName: 'section_type',
      existingType: true,
      useNative: true,
    })
      .notNullable()
      .defaultTo('regular')
    t.integer('parent_id').references('sections.id').onUpdate('CASCADE').onDelete('CASCADE')
    t.smallint('order').notNullable().defaultTo(0)
    t.timestamp('created_at').defaultTo(knex.fn.now())
    t.timestamp('updated_at').defaultTo(knex.fn.now())
    t.index(['slug'], 'sections_slug')
    t.unique(['course_id', 'slug', 'parent_id']) // unique per course
  })

  // Translations

  await knex.schema.createTable('sections_title_trans', (t) => {
    t.integer('section_id')
      .notNullable()
      .references('sections.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    t.string('value').notNullable()
    t.enum('locale', null, {
      enumName: 'locale',
      existingType: true,
      useNative: true,
    }).notNullable()
    t.unique(['section_id', 'locale'])
  })

  await knex.schema.createTable('sections_short_title_trans', (t) => {
    t.integer('section_id')
      .notNullable()
      .references('sections.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    t.string('value').notNullable()
    t.enum('locale', null, {
      enumName: 'locale',
      existingType: true,
      useNative: true,
    }).notNullable()
    t.unique(['section_id', 'locale'])
  })

  await knex.schema.createTable('sections_content_trans', (t) => {
    t.integer('section_id')
      .notNullable()
      .references('sections.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    t.text('value').notNullable()
    t.enum('locale', null, {
      enumName: 'locale',
      existingType: true,
      useNative: true,
    }).notNullable()
    t.unique(['section_id', 'locale'])
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('sections_content_trans')
  await knex.schema.dropTable('sections_short_title_trans')
  await knex.schema.dropTable('sections_title_trans')
  await knex.schema.dropTable('sections')
  await knex.schema.raw('drop type section_type')
}
