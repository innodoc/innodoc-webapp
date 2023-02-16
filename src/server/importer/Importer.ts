import fs from 'fs/promises'
import path from 'path'

import camelcaseKeys from 'camelcase-keys'
import type { Knex } from 'knex'
import { parse as yamlParse } from 'yaml'

import getDatabase from '#server/database/getDatabase'
import type { DbCourse } from '#types/entities/course'
import type { DbPage } from '#types/entities/page'
import type { DbSection } from '#types/entities/section'

import type { InsertResult, Manifest, ManifestPage } from './types'

interface Frontmatter {
  title: string
  shortTitle?: string
  type?: string
}

/** Importer for v1 content folders */
class Importer {
  protected db: Knex | null = null
  protected trx: Knex.Transaction | null = null
  protected importFolder: string | null = null
  protected courseSlug: DbCourse['slug'] | null = null
  protected manifest: Manifest | null = null
  protected courseId: DbCourse['id'] | null = null

  /** Import a course from a folder */
  public async import(importFolder: string, courseSlug: string) {
    this.importFolder = importFolder
    this.courseSlug = courseSlug
    this.db = getDatabase()
    this.trx = await this.db.transaction()
    await this.readManifest()
    await this.createCourse()
    await this.createPages()
    await this.createSections()
    return await this.finish()
  }

  /** Commit transaction and reset import object */
  protected async finish() {
    if (!this.trx || !this.db) throw new Error("Importer wasn't initialized")

    const courseId = this.courseId

    try {
      await this.trx.commit()
    } catch (err) {
      await this.trx.rollback()
      throw err
    } finally {
      await this.db.destroy()
      this.db = null
      this.trx = null
      this.importFolder = null
      this.courseSlug = null
      this.manifest = null
      this.courseId = null
    }

    return courseId
  }

  /** Read course manifest */
  protected async readManifest() {
    if (!this.importFolder) throw new Error("Importer wasn't initialized")

    const yamlBuffer = await fs.readFile(path.join(this.importFolder, 'manifest.yml'))
    this.manifest = yamlParse(yamlBuffer.toString()) as Manifest
  }

  /** Create course entity */
  protected async createCourse() {
    if (!this.trx || !this.manifest) throw new Error("Importer wasn't initialized")

    const courseData = {
      slug: this.courseSlug,
      home_link: this.manifest.home_link,
      locales: this.manifest.languages,
      min_score: this.manifest.min_score,
    }
    const result = (await this.trx('courses').insert([courseData], ['id'])) as InsertResult
    this.courseId = result[0].id

    // Insert titles
    for (const locale of this.manifest.languages) {
      for (const field of ['title', 'short_title'] as const) {
        const value = this.manifest[field]
        if (value) {
          const titleData = { course_id: this.courseId, value: value[locale], locale: locale }
          await this.trx(`courses_${field}_trans`).insert([titleData])
        }
      }
    }
  }

  /** Create all course pages */
  protected async createPages() {
    if (!this.trx || !this.manifest) throw new Error("Importer wasn't initialized")

    for (const page of this.manifest.pages) {
      const pageId = await this.createPage(page)
      await this.createPageContent(pageId, page)
    }
  }

  /** Create page entity */
  protected async createPage(page: ManifestPage) {
    if (!this.trx) throw new Error("Importer wasn't initialized")

    const pageData = {
      slug: page.id,
      icon: page.icon,
      linked: page.linked,
      course_id: this.courseId,
    }
    const result = (await this.trx('pages').insert([pageData], ['id'])) as InsertResult

    return result[0].id
  }

  /** Create page content, title, optional short title */
  protected async createPageContent(pageId: DbPage['id'], page: ManifestPage) {
    if (!this.trx || !this.manifest || !this.importFolder)
      throw new Error("Importer wasn't initialized")

    for (const locale of this.manifest.languages) {
      const pageFilepath = path.join(this.importFolder, locale, '_pages', `${page.id}.md`)
      const {
        frontmatter: { shortTitle, title },
        source,
      } = await this.readContentFile(pageFilepath)

      // Insert title
      const titleData = { page_id: pageId, value: title, locale: locale }
      await this.trx('pages_title_trans').insert([titleData])

      // Insert short title
      if (shortTitle) {
        const shortTitleData = { page_id: pageId, value: shortTitle, locale: locale }
        await this.trx('pages_short_title_trans').insert([shortTitleData])
      }

      // Insert content
      const contentData = { page_id: pageId, value: source, locale: locale }
      await this.trx('pages_content_trans').insert([contentData])
    }
  }

  /** Create all course sections */
  protected async createSections() {
    if (!this.importFolder || !this.manifest) throw new Error("Importer wasn't initialized")

    // Walk down first tree of first locale
    const startDir = path.join(this.importFolder, this.manifest.languages[0])

    const findSectionPaths = async (dirpath: string, parentId: DbSection['parent_id']) => {
      const entries = await fs.readdir(dirpath)
      let order = 0
      for (const entry of entries.sort()) {
        if (!entry.startsWith('_')) {
          const entrypath = path.join(dirpath, entry)
          const stats = await fs.stat(entrypath)
          if (stats.isDirectory()) {
            // Got section dir
            const sectionPath = entrypath.replace(`${startDir}/`, '')
            const sectionId = await this.createSection(sectionPath, order, parentId)
            // Handle child sections
            await findSectionPaths(entrypath, sectionId)
            ++order
          }
        }
      }
    }

    await findSectionPaths(startDir, null)
  }

  /** Create section entity */
  protected async createSection(
    sectionPath: string,
    order: number,
    parentId: DbSection['parent_id']
  ) {
    if (!this.trx || !this.importFolder || !this.courseId || !this.manifest)
      throw new Error("Importer wasn't initialized")

    // Parse content file
    const filepath = this.getSectionFilepath(sectionPath)
    const {
      frontmatter: { shortTitle, title, type: sectionType },
      source,
    } = await this.readContentFile(filepath)

    const sectionPathParts = sectionPath.split('/')
    const slug = sectionPathParts.at(-1)
    if (!slug) throw new Error('slug is empty')

    const sectionData = {
      slug,
      course_id: this.courseId,
      parent_id: parentId,
      order,
      type: sectionType === 'test' ? sectionType : 'regular',
    }
    const result = (await this.trx('sections').insert([sectionData], ['id'])) as InsertResult
    const sectionId = result[0].id

    await this.createSectionContent(sectionId, { shortTitle, source, title })

    return sectionId
  }

  /** Create section content, title, optional short title */
  protected async createSectionContent(
    sectionId: DbSection['id'],
    { shortTitle, source, title }: { shortTitle?: string; source: string; title: string }
  ) {
    if (!this.trx || !this.manifest || !this.importFolder)
      throw new Error("Importer wasn't initialized")

    for (const locale of this.manifest.languages) {
      // Insert title
      const titleData = { section_id: sectionId, value: title, locale: locale }
      await this.trx('sections_title_trans').insert([titleData])

      // Insert short title
      if (shortTitle) {
        const shortTitleData = { section_id: sectionId, value: shortTitle, locale: locale }
        await this.trx('sections_short_title_trans').insert([shortTitleData])
      }

      // Insert content
      const contentData = { section_id: sectionId, value: source, locale: locale }
      await this.trx('sections_content_trans').insert([contentData])
    }
  }

  /** Return section file path */
  protected getSectionFilepath(sectionPath: DbSection['path']) {
    if (!this.manifest || !this.importFolder) throw new Error("Importer wasn't initialized")

    return path.join(this.importFolder, this.manifest.languages[0], sectionPath, 'content.md')
  }

  /** Read and parse Markdown content file, parse YAML frontmatter */
  protected async readContentFile(filepath: string) {
    const markdownFile = await fs.readFile(filepath)
    const { frontmatter, source } = Importer.convertPandocSyntax(markdownFile.toString())
    return { frontmatter, source }
  }

  /** Convert Pandoc syntax to remark-compatible generic directives */
  protected static convertPandocSyntax(content: string) {
    // Extract meta data
    const matches = content.match(/---\s([\s\S]*?)---[\s\S]{2}([\s\S]+)/)
    if (!matches) throw new Error('Could not extract YAML frontmatter')
    const [, yaml, rest] = matches
    const frontmatter = camelcaseKeys(yamlParse(yaml)) as Frontmatter

    // TODO: [Seiten]{data-index-term="Seite"}
    const source = rest
      .replace(/(:{3,}) ?\{.hint-text\}/g, '$1hint-input')
      .replace(/(:{3,}) ?\{.hint\}/g, '$1hint')
      .replace(/(:{3,}) ?\{.hint caption="([^"]+)"\}/g, '$1hint[$2]')
      .replace(/(:{3,}) ?\{\.(example|exercise|figure|info) (#[^}]+)\}/g, '$1$2{$3}')
      .replace(/(:{3,}) ?\{\.(example|exercise|figure|info)\}/g, '$1$2')
      .replace(/:{3,} ?\{\.verify-input-button\}\n(.+)\n:{3,}\n/g, '::verify-button[$1]\n')
      .replace(/(:{3,}) ?\{\.row\}/g, '$1row')
      .replace(/(:{3,}) ?\{\.col ([^}]+)\}/g, '$1col{$2}')
      .replace(/\[\]\{\.question \.(text|checkbox) ([^}]+)\}/g, ':question-$1{$2}')

    return { frontmatter, source }
  }
}

export default Importer
