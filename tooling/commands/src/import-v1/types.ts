import type { CourseSchema, PageLinkLocation, PageSchema, TranslatableString } from '@innodoc/shared-core/types'

interface Manifest extends Omit<CourseSchema, 'locales' | 'title' | 'short_title'> {
  pages: ManifestPage[]
  title: TranslatableString
  short_title?: TranslatableString
  languages: CourseSchema['locales']
}

interface ManifestPage {
  id: PageSchema['slug']
  icon: string
  linked: PageLinkLocation[]
}

type InsertResult = [{ id: number }]

export type { InsertResult, Manifest, ManifestPage }
