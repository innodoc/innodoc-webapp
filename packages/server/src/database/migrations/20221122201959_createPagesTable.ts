import type { Knex } from 'knex'

import { SLUG_RE_POSIX, PAGE_LINK_LOCACTIONS } from '@innodoc/constants'

export async function up(knex: Knex) {
  // Page link location enum type

  const values = PAGE_LINK_LOCACTIONS.join("', '")
  await knex.schema.raw(`create type page_link_location as enum ('${values}')`)

  // pages table

  await knex.schema.createTable('pages', (t) => {
    t.increments('id').primary()
    t.string('slug').notNullable().checkRegex(`^${SLUG_RE_POSIX}$`)
    t.integer('course_id')
      .notNullable()
      .references('courses.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    t.specificType('linked', 'page_link_location[]')
    t.string('icon')
    t.timestamp('created_at').defaultTo(knex.fn.now())
    t.timestamp('updated_at').defaultTo(knex.fn.now())
    t.index(['slug'], 'pages_slug')
    t.unique(['course_id', 'slug']) // unique per course
  })

  // Translations

  await knex.schema.createTable('pages_title_trans', (t) => {
    t.integer('page_id')
      .notNullable()
      .references('pages.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    t.string('value').notNullable()
    t.enum('locale', null, {
      enumName: 'locale',
      existingType: true,
      useNative: true,
    }).notNullable()
    t.unique(['page_id', 'locale'])
  })

  await knex.schema.createTable('pages_short_title_trans', (t) => {
    t.integer('page_id')
      .notNullable()
      .references('pages.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    t.string('value').notNullable()
    t.enum('locale', null, {
      enumName: 'locale',
      existingType: true,
      useNative: true,
    }).notNullable()
    t.unique(['page_id', 'locale'])
  })

  await knex.schema.createTable('pages_content_trans', (t) => {
    t.integer('page_id')
      .notNullable()
      .references('pages.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    t.text('value').notNullable()
    t.enum('locale', null, {
      enumName: 'locale',
      existingType: true,
      useNative: true,
    }).notNullable()
    t.unique(['page_id', 'locale'])
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('pages_content_trans')
  await knex.schema.dropTable('pages_short_title_trans')
  await knex.schema.dropTable('pages_title_trans')
  await knex.schema.dropTable('pages')
  await knex.schema.raw('drop type page_link_location')
}
