import { courseSchema } from './entities/course'
import { fragmentTypeSchema } from './entities/fragment'
import { pageSchema } from './entities/page'
import { querySectionSchema, sectionSchema } from './entities/section'
import type { BaseEntitySchema } from './entities/base'
import type { CourseSchema } from './entities/course'
import type { FragmentTypeSchema } from './entities/fragment'
import type { PageSchema } from './entities/page'
import type { QuerySectionSchema, SectionSchema } from './entities/section'

export type {
  BaseEntitySchema,
  CourseSchema,
  FragmentTypeSchema,
  PageSchema,
  QuerySectionSchema,
  SectionSchema,
}
export { courseSchema, fragmentTypeSchema, pageSchema, querySectionSchema, sectionSchema }
