import type { PageLinkLocation } from '#types/common'
import type { TranslatableString } from '#types/entities/base'
import type { DbCourse } from '#types/entities/course'
import type { DbPage } from '#types/entities/page'

export interface Manifest extends Omit<DbCourse, 'title' | 'short_title'> {
  pages: ManifestPage[]
  title: TranslatableString
  short_title?: TranslatableString
}

export interface ManifestPage {
  id: DbPage['slug']
  icon: string
  linked: PageLinkLocation[]
}

export type InsertResult = [{ id: number }]

export interface Frontmatter {
  title: string
  short_title?: string
  type?: string
}
