import type { ApiCourse, ApiPage, TranslatableString } from '@innodoc/schema/types'
import type { PageLinkLocation } from '@innodoc/types/common'

interface Manifest extends Omit<ApiCourse, 'locales' | 'title' | 'short_title'> {
  pages: ManifestPage[]
  title: TranslatableString
  short_title?: TranslatableString
  languages: ApiCourse['locales']
}

interface ManifestPage {
  id: ApiPage['slug']
  icon: string
  linked: PageLinkLocation[]
}

type InsertResult = [{ id: number }]

export type { InsertResult, Manifest, ManifestPage }
