import type { Knex } from 'knex'

import type { DbCourse, DbPage } from '#server/database/types'

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

      const [{ id: pageId }] = await trx<DbPage>('pages').insert(
        [{ name: 'about', course_id: courseId, icon: 'mdi:home', linked: ['nav', 'footer'] }],
        ['id']
      )

      await trx('pages_title_trans').insert([
        { page_id: pageId, value: 'Über innoDoc', locale: 'de' },
        { page_id: pageId, value: 'About innoDoc', locale: 'en' },
      ])

      await trx('pages_short_title_trans').insert([
        { page_id: pageId, value: 'Über', locale: 'de' },
        { page_id: pageId, value: 'About', locale: 'en' },
      ])

      await trx('pages_content_trans').insert([
        { page_id: pageId, value: JSON.stringify({ type: 'root', foo: 'bar de' }), locale: 'de' },
        { page_id: pageId, value: JSON.stringify({ type: 'root', foo: 'bar en' }), locale: 'en' },
      ])
    })
  } catch (error) {
    console.error(error)
  }
}
