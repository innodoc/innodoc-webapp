import type { PageLinkLocation } from '#types/common'
import type { TranslatableString } from '#types/entities/base'
import type { DbCourse } from '#types/entities/course'
import type { DbPage } from '#types/entities/page'

export interface Manifest extends Omit<DbCourse, 'locales' | 'title' | 'short_title'> {
  pages: ManifestPage[]
  title: TranslatableString
  short_title?: TranslatableString
  languages: DbCourse['locales']
}

export interface ManifestPage {
  id: DbPage['slug']
  icon: string
  linked: PageLinkLocation[]
}

export type InsertResult = [{ id: number }]
