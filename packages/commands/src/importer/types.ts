import type { PageLinkLocation } from '@innodoc/types/common'
import type { DbCourse, DbPage, TranslatableString } from '@innodoc/types/entities'

interface Manifest extends Omit<DbCourse, 'locales' | 'title' | 'short_title'> {
  pages: ManifestPage[]
  title: TranslatableString
  short_title?: TranslatableString
  languages: DbCourse['locales']
}

interface ManifestPage {
  id: DbPage['slug']
  icon: string
  linked: PageLinkLocation[]
}

type InsertResult = [{ id: number }]

export type { InsertResult, Manifest, ManifestPage }
