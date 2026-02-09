import knex, { type Knex } from 'knex'

import defaultKnexConfig from './knexConfig.js'
import { getCourse } from './queries/courses.js'
import { getFragmentContent } from './queries/fragments.js'
import { getCoursePages, getPageContent } from './queries/pages.js'
import { getCourseSections, getSectionContent, getSectionIdByPath } from './queries/sections.js'

/**
 * Database class providing high-level access to entities.
 */
class Database {
  protected _knex?: Knex

  constructor(knexConfig?: Knex.Config) {
    const config = knexConfig ? { ...defaultKnexConfig, ...knexConfig } : defaultKnexConfig
    this._knex = knex(config)
  }

  public get knex() {
    if (!this._knex) {
      throw new Error('Database not initialized')
    }
    return this._knex
  }

  /**
   * Destroy database instance.
   */
  async destroy() {
    if (this._knex !== undefined) {
      await this._knex.destroy()
    }
    this._knex = undefined
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
