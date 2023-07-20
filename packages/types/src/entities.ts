import { defaultTranslatableFields } from './entities/base'
import type {
  BaseEntity,
  TranslatableFields,
  TranslatableString,
  TranslatedEntity,
} from './entities/base'
import type { ApiCourse, DbCourse, TranslatedCourse } from './entities/course'
import type { FragmentType } from './entities/fragment'
import type { ApiPage, DbPage, TranslatedPage } from './entities/page'
import type { ApiSection, DbQuerySection, DbSection, TranslatedSection } from './entities/section'

export type {
  ApiCourse,
  ApiPage,
  ApiSection,
  BaseEntity,
  DbCourse,
  DbPage,
  DbQuerySection,
  DbSection,
  FragmentType,
  TranslatableFields,
  TranslatableString,
  TranslatedCourse,
  TranslatedEntity,
  TranslatedPage,
  TranslatedSection,
}
export { defaultTranslatableFields }
