import type { PageLinkLocation } from '@innodoc/types/common'
import type { DbCourse, DbPage, TranslatableString } from '@innodoc/types/entities'

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
