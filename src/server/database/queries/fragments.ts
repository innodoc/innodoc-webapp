import type { LanguageCode } from 'iso-639-1'

import getDatabase from '#server/database/getDatabase'
import type { FragmentType } from '#types/entities/base'
import type { DbCourse } from '#types/entities/course'

import type { ContentResult, ContentResultFromValue } from './types'

export async function getFragmentContent(
  courseId: DbCourse['id'],
  locale: LanguageCode,
  fragmentType: FragmentType
): Promise<ContentResult> {
  const db = getDatabase()
  const result = await db
    .first<ContentResultFromValue>('ct.value')
    .from('fragments as f')
    .join('courses as c', 'f.course_id', 'c.id')
    .leftOuterJoin('fragments_content_trans as ct', 'f.id', 'ct.fragment_id')
    .where('f.type', fragmentType)
    .where('c.id', courseId)
    .where('ct.locale', locale)

  return result ? result.value : undefined
}
