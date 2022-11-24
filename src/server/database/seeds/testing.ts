import type { Knex } from 'knex'

import type { DbCourse, DbPage, DbSection } from '#server/database/types'

export async function seed(knex: Knex) {
  try {
    await knex.transaction(async (trx) => {
      // Course

      const [{ id: courseId }] = await trx<DbCourse>('courses').insert(
        [{ name: 'innodoc', locales: ['de', 'en'], home_link: '/page/about' }],
        ['id']
      )
      await trx('courses_title_trans').insert([
        { course_id: courseId, value: 'Foo long (de)', locale: 'de' },
        { course_id: courseId, value: 'Foo long (en)', locale: 'en' },
      ])
      await trx('courses_short_title_trans').insert([
        { course_id: courseId, value: 'Foo short (de)', locale: 'de' },
        { course_id: courseId, value: 'Foo short (en)', locale: 'en' },
      ])
      await trx('courses_description_trans').insert([
        { course_id: courseId, value: 'Foo description (de)', locale: 'de' },
        { course_id: courseId, value: 'Foo description (en)', locale: 'en' },
      ])

      // About page

      const [{ id: aPageId }] = await trx<DbPage>('pages').insert(
        [
          {
            name: 'about',
            course_id: courseId,
            icon: 'mdi:information-outline',
            linked: ['nav', 'footer'],
          },
        ],
        ['id']
      )
      await trx('pages_title_trans').insert([
        { page_id: aPageId, value: 'Über innoDoc', locale: 'de' },
        { page_id: aPageId, value: 'About innoDoc', locale: 'en' },
      ])
      await trx('pages_short_title_trans').insert([
        { page_id: aPageId, value: 'Über', locale: 'de' },
        { page_id: aPageId, value: 'About', locale: 'en' },
      ])
      await trx('pages_content_trans').insert([
        {
          page_id: aPageId,
          value: JSON.stringify({
            type: 'root',
            children: [{ type: 'paragraph', children: [{ type: 'text', value: 'Yep, läuft!' }] }],
          }),
          locale: 'de',
        },
        {
          page_id: aPageId,
          value: JSON.stringify({
            type: 'root',
            children: [
              { type: 'paragraph', children: [{ type: 'text', value: "Yep, it's working!" }] },
            ],
          }),
          locale: 'en',
        },
      ])

      // License page

      const [{ id: lPageId }] = await trx<DbPage>('pages').insert(
        [{ name: 'license', course_id: courseId, icon: 'mdi:copyright', linked: ['footer'] }],
        ['id']
      )
      await trx('pages_title_trans').insert([
        { page_id: lPageId, value: 'Lizenz', locale: 'de' },
        { page_id: lPageId, value: 'License', locale: 'en' },
      ])
      await trx('pages_content_trans').insert([
        {
          page_id: lPageId,
          value: JSON.stringify({
            type: 'root',
            children: [{ type: 'paragraph', children: [{ type: 'text', value: 'Yep, läuft!' }] }],
          }),
          locale: 'de',
        },
        {
          page_id: lPageId,
          value: JSON.stringify({
            type: 'root',
            children: [
              { type: 'paragraph', children: [{ type: 'text', value: "Yep, it's working!" }] },
            ],
          }),
          locale: 'en',
        },
      ])

      // Section 1

      const [{ id: section1Id }] = await trx<DbSection>('sections').insert(
        [{ path: 'section1', course_id: courseId, order: 0 }],
        ['id']
      )
      await trx('sections_title_trans').insert([
        { section_id: section1Id, value: 'Section 1', locale: 'de' },
        { section_id: section1Id, value: 'Section 1', locale: 'en' },
      ])
      await trx('sections_content_trans').insert([
        {
          section_id: section1Id,
          value: JSON.stringify({
            type: 'root',
            children: [
              { type: 'paragraph', children: [{ type: 'text', value: 'Section 1 content de' }] },
            ],
          }),
          locale: 'de',
        },
        {
          section_id: section1Id,
          value: JSON.stringify({
            type: 'root',
            children: [
              { type: 'paragraph', children: [{ type: 'text', value: 'Section 1 content en' }] },
            ],
          }),
          locale: 'en',
        },
      ])

      // Section 1.1

      const [{ id: section11Id }] = await trx<DbSection>('sections').insert(
        [{ path: 'section1.section1', course_id: courseId, order: 0 }],
        ['id']
      )
      await trx('sections_title_trans').insert([
        { section_id: section11Id, value: 'Section 1.1', locale: 'de' },
        { section_id: section11Id, value: 'Section 1.1', locale: 'en' },
      ])
      await trx('sections_content_trans').insert([
        {
          section_id: section11Id,
          value: JSON.stringify({
            type: 'root',
            children: [
              { type: 'paragraph', children: [{ type: 'text', value: 'Section 1.1 content de' }] },
            ],
          }),
          locale: 'de',
        },
        {
          section_id: section11Id,
          value: JSON.stringify({
            type: 'root',
            children: [
              { type: 'paragraph', children: [{ type: 'text', value: 'Section 1.1 content en' }] },
            ],
          }),
          locale: 'en',
        },
      ])

      // Section 1.2

      const [{ id: section12Id }] = await trx<DbSection>('sections').insert(
        [{ path: 'section1.section2', course_id: courseId, order: 1 }],
        ['id']
      )
      await trx('sections_title_trans').insert([
        { section_id: section12Id, value: 'Section 1.2', locale: 'de' },
        { section_id: section12Id, value: 'Section 1.2', locale: 'en' },
      ])
      await trx('sections_content_trans').insert([
        {
          section_id: section12Id,
          value: JSON.stringify({
            type: 'root',
            children: [
              { type: 'paragraph', children: [{ type: 'text', value: 'Section 1.2 content de' }] },
            ],
          }),
          locale: 'de',
        },
        {
          section_id: section12Id,
          value: JSON.stringify({
            type: 'root',
            children: [
              { type: 'paragraph', children: [{ type: 'text', value: 'Section 1.2 content en' }] },
            ],
          }),
          locale: 'en',
        },
      ])

      // Section 2

      const [{ id: section2Id }] = await trx<DbSection>('sections').insert(
        [{ path: 'section2', course_id: courseId, order: 1 }],
        ['id']
      )
      await trx('sections_title_trans').insert([
        { section_id: section2Id, value: 'Section 2', locale: 'de' },
        { section_id: section2Id, value: 'Section 2', locale: 'en' },
      ])
      await trx('sections_content_trans').insert([
        {
          section_id: section2Id,
          value: JSON.stringify({
            type: 'root',
            children: [
              { type: 'paragraph', children: [{ type: 'text', value: 'Section 2 content de' }] },
            ],
          }),
          locale: 'de',
        },
        {
          section_id: section2Id,
          value: JSON.stringify({
            type: 'root',
            children: [
              { type: 'paragraph', children: [{ type: 'text', value: 'Section 2 content en' }] },
            ],
          }),
          locale: 'en',
        },
      ])
    })
  } catch (error) {
    console.error(error)
  }
}
