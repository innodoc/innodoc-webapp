import type { Knex } from 'knex'

import { DEFAULT_MIN_SCORE, SLUG_RE_POSIX } from '@innodoc/constants'

export async function up(knex: Knex) {
  // courses table

  await knex.schema.createTable('courses', (t) => {
    t.increments('id').primary()
    t.string('slug').notNullable().unique().checkRegex(`^${SLUG_RE_POSIX}$`)
    t.string('home_link')
    t.specificType('locales', 'locale[]')
    t.smallint('min_score').notNullable().defaultTo(DEFAULT_MIN_SCORE).checkBetween([0, 100])
    t.timestamp('created_at').defaultTo(knex.fn.now())
    t.timestamp('updated_at').defaultTo(knex.fn.now())
    t.index(['slug'], 'courses_slug')
  })

  // Translations

  await knex.schema.createTable('courses_title_trans', (t) => {
    t.integer('course_id')
      .notNullable()
      .references('courses.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    t.string('value').notNullable()
    t.enum('locale', null, {
      enumName: 'locale',
      existingType: true,
      useNative: true,
    }).notNullable()
    t.unique(['course_id', 'locale'])
  })

  await knex.schema.createTable('courses_short_title_trans', (t) => {
    t.integer('course_id')
      .notNullable()
      .references('courses.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    t.string('value').notNullable()
    t.enum('locale', null, {
      enumName: 'locale',
      existingType: true,
      useNative: true,
    }).notNullable()
    t.unique(['course_id', 'locale'])
  })

  await knex.schema.createTable('courses_description_trans', (t) => {
    t.integer('course_id')
      .notNullable()
      .references('courses.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    t.string('value').notNullable()
    t.enum('locale', null, {
      enumName: 'locale',
      existingType: true,
      useNative: true,
    }).notNullable()
    t.unique(['course_id', 'locale'])
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('courses_description_trans')
  await knex.schema.dropTable('courses_short_title_trans')
  await knex.schema.dropTable('courses_title_trans')
  await knex.schema.dropTable('courses')
}
