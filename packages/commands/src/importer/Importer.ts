import fs from 'fs/promises'
import path from 'path'

import camelcaseKeys from 'camelcase-keys'
import type { Knex } from 'knex'
import { parse as yamlParse } from 'yaml'

import getDatabase from '@innodoc/server/database'
import type { DbCourse } from '@innodoc/types/entities'
import type { DbSection } from '@innodoc/types/entities'

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
    if (!this.trx || !this.db) {
      throw new Error("Importer wasn't initialized")
    }

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
    if (!this.importFolder) {
      throw new Error("Importer wasn't initialized")
    }

    const yamlBuffer = await fs.readFile(path.join(this.importFolder, 'manifest.yml'))
    this.manifest = yamlParse(yamlBuffer.toString()) as Manifest
  }

  /** Create course entity */
  protected async createCourse() {
    if (!this.trx || !this.manifest) {
      throw new Error("Importer wasn't initialized")
    }

    const courseData = {
      slug: this.courseSlug,
      home_link: Importer.transformLink(this.manifest.home_link),
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
    if (!this.trx || !this.manifest || !this.importFolder) {
      throw new Error("Importer wasn't initialized")
    }

    for (const page of this.manifest.pages) {
      const pageId = await this.createPage(page)

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
  }

  /** Create page entity */
  protected async createPage(page: ManifestPage) {
    if (!this.trx) {
      throw new Error("Importer wasn't initialized")
    }

    const pageData = {
      slug: page.id,
      icon: page.icon,
      linked: page.linked,
      course_id: this.courseId,
    }
    const result = (await this.trx('pages').insert([pageData], ['id'])) as InsertResult

    return result[0].id
  }

  /** Create all course sections */
  protected async createSections() {
    if (!this.importFolder || !this.manifest) {
      throw new Error("Importer wasn't initialized")
    }

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
    if (!this.trx || !this.importFolder || !this.courseId || !this.manifest) {
      throw new Error("Importer wasn't initialized")
    }

    let sectionId = 0

    for (const locale of this.manifest.languages) {
      const sectionFilepath = path.join(this.importFolder, locale, sectionPath, 'content.md')
      const {
        frontmatter: { shortTitle, title, type: sectionType },
        source,
      } = await this.readContentFile(sectionFilepath)

      // Create section
      if (locale === this.manifest.languages[0]) {
        const sectionPathParts = sectionPath.split('/')
        const slug = sectionPathParts.at(-1)
        if (!slug) {
          throw new Error('slug is empty')
        }

        const sectionData = {
          slug,
          course_id: this.courseId,
          parent_id: parentId,
          order,
          type: sectionType === 'test' ? sectionType : 'regular',
        }
        const result = (await this.trx('sections').insert([sectionData], ['id'])) as InsertResult
        sectionId = result[0].id
      }

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

    return sectionId
  }

  /** Read and parse Markdown content file, parse YAML frontmatter */
  protected async readContentFile(filepath: string) {
    const markdownFile = await fs.readFile(filepath)
    const { frontmatter, source } = Importer.convertPandocSyntax(markdownFile.toString())
    return { frontmatter, source }
  }

  // TODO convert to MDX
  /** Convert Pandoc syntax to remark-compatible generic directives */
  protected static convertPandocSyntax(content: string) {
    // Extract meta data
    const matches = content.match(/---\s([\s\S]*?)---[\s\S]{2}([\s\S]+)/)
    if (!matches) {
      console.log(content)
      throw new Error('Could not extract YAML frontmatter')
    }
    const [, yaml, rest] = matches
    const frontmatter = camelcaseKeys(yamlParse(yaml)) as Frontmatter

    // TODO: [Seiten]{data-index-term="Seite"}
    const source = rest

      // cards
      .replace(/(:{3,}) ?\{.hint-text\}/g, '$1input-hint')
      .replace(/\[([^\]]+)\]\{\.hint-text\}/g, ':::input-hint\n$1\n:::\n')
      .replace(/(:{3,}) ?\{.hint\}/g, '$1hint')
      .replace(/(:{3,}) ?\{.hint caption="(?:Lösung|Solution)"\}/g, '$1solution')
      .replace(/(:{3,}) ?\{\.(example|exercise|figure|info) (#[^}]+)\}/g, '$1$2{$3}')
      .replace(/(:{3,}) ?\{\.(example|exercise|figure|info)\}/g, '$1$2')

      // exercises
      .replace(/:{3,} ?\{\.verify-input-button\}\n(.+)\n:{3,}\n/g, '::verify-button[$1]\n')
      .replace(/\[\]\{\.question \.(text|checkbox) ([^}]+)\}/g, ':question-$1{$2}')

      // links
      .replace(/\[([^\]]*)\]\(\/(section|page)\/([^)]+)\)/g, '[$1](app:$2|$3)')

    return { frontmatter, source }
  }

  /** Transform link to specififer syntax */
  protected static transformLink(href: string) {
    return href.replace(/^\/page\//, 'app:page|').replace(/^\/section\//, 'app:section|')
  }
}

export default Importer
