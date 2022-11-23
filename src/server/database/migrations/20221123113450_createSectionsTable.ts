import type { Knex } from 'knex'

import { SECTION_TYPES } from '#constants'

type InstalledInfo = {
  installed_version: string | null
}

export async function up(knex: Knex) {
  // Enable ltree extension

  const ltreeInfo = await knex<InstalledInfo>('pg_available_extensions')
    .select('installed_version')
    .where('name', 'ltree')
    .first()
  if (ltreeInfo === undefined) {
    throw new Error('You need to install the ltree extension on your PostgreSQL database.')
  }
  if (ltreeInfo.installed_version === null) {
    await knex.schema.raw('create extension ltree')
  }

  const values = SECTION_TYPES.join("', '")
  await knex.schema.raw(`create type section_type as enum ('${values}')`)

  // sections table

  await knex.schema.createTable('sections', (t) => {
    t.increments('id').primary()
    t.integer('course_id')
      .notNullable()
      .references('courses.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    t.enum('type', null, {
      enumName: 'section_type',
      existingType: true,
      useNative: true,
    }).notNullable()
    t.specificType('path', 'ltree')
    t.index('path', 'idx_path', 'gist')
    t.timestamp('created_at').defaultTo(knex.fn.now())
    t.timestamp('updated_at').defaultTo(knex.fn.now())
    t.unique(['type', 'course_id', 'path']) // unique per course
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
    t.jsonb('value').notNullable().defaultTo(JSON.stringify({}))
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
