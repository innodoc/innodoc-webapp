import camelcaseKeys from 'camelcase-keys'
import type { LanguageCode } from 'iso-639-1'
import type { Root } from 'mdast'

import getDatabase from '#server/database/getDatabase'
import type { ContentFragmentType } from '#types/entities/base'
import type { ApiCourse, DbCourse } from '#types/entities/course'
import type { ApiPage, DbPage } from '#types/entities/page'
import type { ApiSection, DbQuerySection, DbSection } from '#types/entities/section'

export async function getCourse({
  courseId,
  courseSlug,
}: {
  courseId?: DbCourse['id']
  courseSlug?: DbCourse['slug']
}): Promise<ApiCourse | null> {
  let field
  let val
  if (courseId !== undefined) {
    field = 'c.id'
    val = courseId
  } else if (courseSlug !== undefined) {
    field = 'c.slug'
    val = courseSlug
  } else {
    throw new Error('getCourse() must receiver either courseId or courseSlug')
  }

  const db = getDatabase()
  const result = await db
    .first<DbCourse | null>(
      'c.*',
      db.raw('array_to_json(c.locales) as locales'),
      db.raw('json_object_agg(t.locale, t.value) as title'),
      db.raw('json_object_agg(st.locale, st.value) as short_title'),
      db.raw('json_object_agg(d.locale, d.value) as description')
    )
    .from('courses as c')
    .join('courses_title_trans as t', 'c.id', 't.course_id')
    .join('courses_short_title_trans as st', 'c.id', 'st.course_id')
    .join('courses_description_trans as d', 'c.id', 'd.course_id')
    .where(field, val)
    .groupBy('c.id')

  return result ? camelcaseKeys(result) : null
}

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

export async function getPageContent(
  courseId: DbCourse['id'],
  locale: LanguageCode,
  pageId: DbPage['id']
): Promise<Root | undefined> {
  const db = getDatabase()
  const result = await db
    .first<ContentResult>('ct.value')
    .from('pages as p')
    .join('courses as c', 'p.course_id', 'c.id')
    .leftOuterJoin('pages_content_trans as ct', 'p.id', 'ct.page_id')
    .where('p.id', pageId)
    .where('c.id', courseId)
    .where('ct.locale', locale)

  return result ? result.value : undefined
}

export async function getCourseSections(courseId: DbCourse['id']): Promise<ApiSection[]> {
  const db = getDatabase()
  const result = (await db
    .withRecursive(
      'cre',
      ['id', 'slug', 'path', 'course_id', 'type', 'parent_id', 'order', 'created_at', 'updated_at'],
      (qb) => {
        void qb
          // Start with root node
          .select(
            's.id',
            's.slug',
            db.raw('s.slug::varchar'),
            's.course_id',
            's.type',
            's.parent_id',
            db.raw('array[s.order]::integer[]'),
            's.created_at',
            's.updated_at'
          )
          .from('sections as s')
          .join('courses as c', 's.course_id', 'c.id')
          .where('s.parent_id', null)
          .where('c.id', courseId)
          .union((qb) => {
            // Add one level of children on each iteration
            void qb
              .select(
                's.id',
                's.slug',
                db.raw("cre.path || '/' || s.slug"),
                's.course_id',
                's.type',
                's.parent_id',
                db.raw('cre.order || s.order'),
                's.created_at',
                's.updated_at'
              )
              .from('sections as s')
              .join('cre', 'cre.id', 's.parent_id')
          })
      }
    )
    .select(
      'cre.id',
      'cre.slug',
      'cre.path',
      'cre.course_id',
      'cre.type',
      'cre.parent_id',
      'cre.order',
      'cre.created_at',
      'cre.updated_at',
      db.raw('json_object_agg(t.locale, t.value) as title'),
      db.raw(
        'json_object_agg(st.locale, st.value) filter (where st.locale is not null) as short_title'
      )
    )
    .from('cre')
    .join('sections_title_trans as t', 'cre.id', 't.section_id')
    .leftOuterJoin('sections_short_title_trans as st', 'cre.id', 'st.section_id')
    .groupBy(
      'cre.id',
      'cre.slug',
      'cre.path',
      'cre.course_id',
      'cre.type',
      'cre.parent_id',
      'cre.order',
      'cre.created_at',
      'cre.updated_at'
    )
    .orderBy('cre.order')) as DbQuerySection[]

  return camelcaseKeys(result)
}

export async function getSectionContent(
  courseId: DbCourse['id'],
  locale: LanguageCode,
  sectionId: DbSection['id']
): Promise<Root | undefined> {
  const db = getDatabase()
  const result = await db
    .first<{ value: Root } | undefined>('ct.value')
    .from('sections as s')
    .join('courses as c', 's.course_id', 'c.id')
    .leftOuterJoin('sections_content_trans as ct', 's.id', 'ct.section_id')
    .where('s.id', sectionId)
    .where('c.id', courseId)
    .where('ct.locale', locale)

  return result ? result.value : undefined
}

export async function getFragmentContent(
  courseId: DbCourse['id'],
  locale: LanguageCode,
  fragmentType: ContentFragmentType
): Promise<Root | undefined> {
  const db = getDatabase()
  const result = await db
    .first<{ value: Root } | undefined>('ct.value')
    .from('fragments as f')
    .join('courses as c', 'f.course_id', 'c.id')
    .leftOuterJoin('fragments_content_trans as ct', 'f.id', 'ct.fragment_id')
    .where('f.type', fragmentType)
    .where('c.id', courseId)
    .where('ct.locale', locale)

  return result ? result.value : undefined
}

type ContentResult = { value: Root } | undefined
