import camelcaseKeys from 'camelcase-keys'
import type { LanguageCode } from 'iso-639-1'

import getDatabase from '#server/database/getDatabase'
import type { DbCourse } from '#types/entities/course'
import type { MarkdownDoc } from '#types/entities/markdown'
import type { DbPage, ApiPage } from '#types/entities/page'

import type { ResultFromValue, IdResult } from './types'

export async function getCoursePages(courseId: DbCourse['id']): Promise<ApiPage[]> {
  const db = getDatabase()
  const result = await db
    .select<DbPage[]>(
      'p.*',
      db.raw('array_to_json(p.linked) as linked'),
      db.raw('json_object_agg(t.locale, t.value) as title'),
      db.raw(
        'json_object_agg(st.locale, st.value) filter (where st.locale is not null) as short_title'
      )
    )
    .from('pages as p')
    .join('courses as c', 'p.course_id', 'c.id')
    .join('pages_title_trans as t', 'p.id', 't.page_id')
    .leftOuterJoin('pages_short_title_trans as st', 'p.id', 'st.page_id')
    .where('c.id', courseId)
    .groupBy('p.id')

  return camelcaseKeys(result)
}

export async function getPageIdBySlug(
  courseId: DbCourse['id'],
  pageSlug: DbPage['slug']
): Promise<ApiPage['id'] | undefined> {
  const db = getDatabase()
  const result = await db
    .first<IdResult | undefined>('p.id')
    .from('pages as p')
    .join('courses as c', 'p.course_id', 'c.id')
    .where('p.slug', pageSlug)
    .where('c.id', courseId)

  return result?.id
}

export async function getPageContent(
  courseId: DbCourse['id'],
  locale: LanguageCode,
  pageId: DbPage['id']
): Promise<MarkdownDoc | undefined> {
  const db = getDatabase()
  const result = await db
    .first<ResultFromValue<MarkdownDoc>>('ct.value')
    .from('pages as p')
    .join('courses as c', 'p.course_id', 'c.id')
    .leftOuterJoin('pages_content_trans as ct', 'p.id', 'ct.page_id')
    .where('p.id', pageId)
    .where('c.id', courseId)
    .where('ct.locale', locale)

  return result ? result.value : undefined
}
