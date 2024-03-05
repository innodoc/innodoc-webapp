import knex, { type Knex } from 'knex'

import defaultKnexConfig from './knexConfig'
import { getCourse } from './queries/courses'
import { getFragmentContent } from './queries/fragments'
import { getCoursePages, getPageContent } from './queries/pages'
import { getCourseSections, getSectionContent, getSectionIdByPath } from './queries/sections'

/**
 * Database class providing high-level access to entities.
 */
class Database {
  protected knex?: Knex

  constructor(knexConfig?: Knex.Config) {
    const config = knexConfig ? { ...defaultKnexConfig, ...knexConfig } : defaultKnexConfig
    this.knex = knex(config)
  }

  /**
   * Destroy database instance.
   */
  async destroy() {
    if (this.knex !== undefined) {
      await this.knex.destroy()
    }
    this.knex = undefined
  }

  /**
   * Get default knex configuration.
   */
  static getDefaultConfig() {
    return defaultKnexConfig
  }

  getCourse = getCourse
  getFragmentContent = getFragmentContent
  getCoursePages = getCoursePages
  getPageContent = getPageContent
  getCourseSections = getCourseSections
  getSectionIdByPath = getSectionIdByPath
  getSectionContent = getSectionContent
}

export default Database
