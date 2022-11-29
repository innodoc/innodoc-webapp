import fs from 'fs/promises'
import path from 'path'

import yaml from 'js-yaml'
import type { Knex } from 'knex'

import getDatabase from '#server/database/getDatabase'
import type { PageLinkLocation } from '#types/common'
import type { TranslatableString } from '#types/entities/base'
import type { DbCourse } from '#types/entities/course'
import type { DbPage } from '#types/entities/page'

import parseMarkdown from './parseMarkdown'

class Importer {
  db: Knex
  importFolder: string
  courseSlug: DbCourse['slug']
  manifest: Manifest
  courseId: DbCourse['id'] | null

  constructor(importFolder: string, courseSlug: string, manifest: Manifest) {
    this.db = getDatabase()
    this.importFolder = importFolder
    this.courseSlug = courseSlug
    this.manifest = manifest
    this.courseId = null
  }

  async import() {
    await this.createCourse()
    await this.createPages()
    await this.destroy()
    return this.courseId
  }

  async createCourse() {
    const result = (await this.db('courses').insert(
      [
        {
          slug: this.courseSlug,
          home_link: this.manifest.home_link,
          locales: this.manifest.locales,
          min_score: this.manifest.min_score,
        },
      ],
      ['id']
    )) as InsertResult
    this.courseId = result[0].id

    // Insert titles
    for (const locale of this.manifest.locales) {
      for (const field of ['title', 'short_title'] as const) {
        const value = this.manifest[field]
        if (value) {
          await this.db(`courses_${field}_trans`).insert([
            {
              course_id: this.courseId,
              value: value[locale],
              locale: locale,
            },
          ])
        }
      }
    }
  }

  async createPages() {
    for (const page of this.manifest.pages) {
      const pageId = await this.createPage(page)
      await this.createPageContent(pageId, page)
    }
  }

  async createPage(page: ManifestPage) {
    const result = (await this.db('pages').insert(
      [
        {
          slug: page.id,
          icon: page.icon,
          linked: page.linked,
          course_id: this.courseId,
        },
      ],
      ['id']
    )) as InsertResult

    return result[0].id
  }

  async createPageContent(pageId: DbPage['id'], page: ManifestPage) {
    for (const locale of this.manifest.locales) {
      const pageFilepath = path.join(this.importFolder, locale, '_pages', `${page.id}.md`)
      const markdownBuffer = await fs.readFile(pageFilepath)
      const rootNode = parseMarkdown(markdownBuffer.toString())

      // Parse YAML frontmatter
      const yamlNode = rootNode.children.shift()
      if (!yamlNode || yamlNode.type !== 'yaml') {
        throw new Error(`YAML frontmatter not found for page ${page.id}`)
      }
      const yamlData = yaml.load(yamlNode.value) as Frontmatter
      const { title, short_title: shortTitle } = yamlData

      // Insert title
      await this.db('pages_title_trans').insert([
        {
          page_id: pageId,
          value: title,
          locale: locale,
        },
      ])

      // Insert short title
      if (shortTitle) {
        await this.db('pages_short_title_trans').insert([
          {
            page_id: pageId,
            value: shortTitle,
            locale: locale,
          },
        ])
      }

      // Insert content
      await this.db('pages_content_trans').insert([
        {
          page_id: pageId,
          value: rootNode,
          locale: locale,
        },
      ])
    }
  }

  async destroy() {
    if (this.db) await this.db.destroy()
  }
}

async function importFromV1() {
  // CLI args
  if (process.argv.length !== 4) {
    throw new Error('Provide path to content as first argument')
  }
  const importFolder = process.argv[2]
  const courseSlug = process.argv[3]

  // Read manifest
  const yamlBuffer = await fs.readFile(path.join(importFolder, 'manifest.yml'))
  const manifest = yaml.load(yamlBuffer.toString()) as Manifest

  const importer = new Importer(importFolder, courseSlug, manifest)
  const courseId = await importer.import()
  if (courseId === null) throw new Error('courseId is null')

  return courseId
}

importFromV1()
  .then((result) => {
    console.log(result)
    return undefined
  })
  .catch((err) => {
    console.error(err)
  })

interface Manifest extends Omit<DbCourse, 'title' | 'short_title'> {
  pages: ManifestPage[]
  title: TranslatableString
  short_title?: TranslatableString
}

interface ManifestPage {
  id: DbPage['slug']
  icon: string
  linked: PageLinkLocation[]
}

type InsertResult = [{ id: number }]

interface Frontmatter {
  title: string
  short_title?: string
}
