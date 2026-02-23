import knex from 'knex'
import type { LanguageCode } from 'iso-639-1'
import type { Knex } from 'knex'

import type {
  ConfigSchema,
  CourseSchema,
  FragmentTypeSchema,
  PageSchema,
  SectionSchema,
} from '@innodoc/shared-core/types'

import makeKnexConfig from './knex-config.js'
import { getCourse } from './queries/courses.js'
import { getFragmentContent } from './queries/fragments.js'
import { getCoursePages, getPageContent } from './queries/pages.js'
import { getCourseSections, getSectionContent, getSectionIdByPath } from './queries/sections.js'

/**
 * Database class providing high-level access to entities.
 */
class Database {
  #knex?: Knex

  constructor(config: ConfigSchema, knexConfig?: Knex.Config) {
    const defaultKnexConfig = makeKnexConfig(config)
    const resultingKnexConfig = knexConfig ? { ...defaultKnexConfig, ...knexConfig } : defaultKnexConfig
    this.#knex = knex(resultingKnexConfig)
  }

  public get knex() {
    if (!this.#knex) {
      throw new Error('Database not initialized')
    }
    return this.#knex
  }

  /**
   * Destroy database instance.
   */
  async destroy() {
    if (this.#knex !== undefined) {
      await this.#knex.destroy()
    }
    this.#knex = undefined
  }

  getCourse = (courseSlug: CourseSchema['slug']) => getCourse(this.knex, courseSlug)

  getFragmentContent = (courseSlug: CourseSchema['slug'], locale: LanguageCode, fragmentType: FragmentTypeSchema) =>
    getFragmentContent(this.knex, courseSlug, locale, fragmentType)

  getCoursePages = (courseSlug: CourseSchema['slug']) => getCoursePages(this.knex, courseSlug)

  getPageContent = (courseSlug: CourseSchema['slug'], locale: LanguageCode, pageSlug: PageSchema['slug']) =>
    getPageContent(this.knex, courseSlug, locale, pageSlug)

  getCourseSections = (courseSlug: CourseSchema['slug']) => getCourseSections(this.knex, courseSlug)

  getSectionIdByPath = (courseSlug: CourseSchema['slug'], sectionPath: SectionSchema['path']) =>
    getSectionIdByPath(this.knex, courseSlug, sectionPath)

  getSectionContent = (courseSlug: CourseSchema['slug'], locale: LanguageCode, sectionId: SectionSchema['id']) =>
    getSectionContent(this.knex, courseSlug, locale, sectionId)
}

export default Database
