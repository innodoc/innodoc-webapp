import type { InsertResult } from './types.js'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, expect, test, vi } from 'vitest'
import Importer from './Importer.js'

// The import path's only boundary is the database: the importer's file reads stay real, the knex
// instance is faked per test. The fake records every insert and answers the coverage check's
// locale selects with the final state the test scripts, so a mismatch between the declared
// locales and the stored content rows is what the warning must report.
interface CoverageScript {
  pages: string[]
  sections: string[]
}

interface FakeRow {
  locale: string
}

interface FakeBuilder {
  insert(rows: readonly unknown[], returning?: readonly string[]): Promise<InsertResult>
  distinct(column: string): FakeBuilder
  select(column: string): FakeBuilder
  whereIn(column: string, values: readonly number[]): Promise<FakeRow[]>
}

type FakeTrx = ((table: string) => FakeBuilder) & {
  commit(): Promise<void>
  rollback(): Promise<void>
}

interface FakeKnex {
  transaction(): Promise<FakeTrx>
  destroy(): Promise<void>
}

const { knexRef } = vi.hoisted(() => ({
  knexRef: { current: undefined as FakeKnex | undefined },
}))

vi.mock('@innodoc/server-db', () => ({
  default: class Database {
    knex = knexRef.current
  },
}))

vi.mock('@innodoc/server-env', () => ({
  default: () => ({}),
}))

function makeFakeKnex(coverage: CoverageScript): FakeKnex {
  let nextId = 0

  const builderFor = (table: string): FakeBuilder => {
    const builder: FakeBuilder = {
      insert: (rows) => {
        void rows
        return Promise.resolve([{ id: ++nextId }])
      },
      distinct: () => builder,
      select: () => builder,
      whereIn: () => {
        const locales = table === 'pages_content_trans' ? coverage.pages : coverage.sections
        return Promise.resolve(locales.map((locale) => ({ locale })))
      },
    }
    return builder
  }

  const trx: FakeTrx = Object.assign((table: string) => builderFor(table), {
    commit: () => Promise.resolve(),
    rollback: () => Promise.resolve(),
  })

  return {
    transaction: () => Promise.resolve(trx),
    destroy: () => Promise.resolve(),
  }
}

const MANIFEST = `
languages:
  - en
  - de
home_link: /page/home
min_score: 0
title:
  en: Test course
  de: Kurs zum Testen
pages:
  - id: home
    icon: mdi:home
    linked:
      - footer
      - nav
`

const PAGE_EN = `---
title: Home
---

# Home

English content
`

const PAGE_DE = `---
title: Home-Seite
---

# Home

Deutscher Inhalt
`

/** A v1 content folder whose manifest declares en and de, with content for both */
async function makeImportFolder(): Promise<string> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'import-v1-'))
  await writeFile(path.join(dir, 'manifest.yml'), MANIFEST)
  await mkdir(path.join(dir, 'en', '_pages'), { recursive: true })
  await writeFile(path.join(dir, 'en', '_pages', 'home.md'), PAGE_EN)
  await mkdir(path.join(dir, 'de', '_pages'), { recursive: true })
  await writeFile(path.join(dir, 'de', '_pages', 'home.md'), PAGE_DE)
  return dir
}

let importDir: string | undefined

afterEach(async () => {
  knexRef.current = undefined
  vi.restoreAllMocks()
  if (importDir !== undefined) {
    await rm(importDir, { recursive: true, force: true })
    importDir = undefined
  }
})

test('an import whose content covers every declared locale warns nothing', async () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(vi.fn())
  importDir = await makeImportFolder()
  knexRef.current = makeFakeKnex({ pages: ['en', 'de'], sections: [] })

  const courseId = await new Importer().import(importDir, 'test-course')

  expect(courseId).toBe(1)
  expect(warn).not.toHaveBeenCalled()
})

test('an import whose content misses a declared locale warns once, naming the course and locale', async () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(vi.fn())
  importDir = await makeImportFolder()
  // The final state holds no content row in `de` although the course declares it
  knexRef.current = makeFakeKnex({ pages: ['en'], sections: [] })

  await new Importer().import(importDir, 'test-course')

  expect(warn).toHaveBeenCalledTimes(1)
  const message = String(warn.mock.calls[0]?.[0] ?? '')
  expect(message).toContain('test-course')
  expect(message).toContain('de')
})

test('an import whose content covers an undeclared locale warns, naming the course and locale', async () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(vi.fn())
  importDir = await makeImportFolder()
  knexRef.current = makeFakeKnex({ pages: ['en', 'de', 'fr'], sections: [] })

  await new Importer().import(importDir, 'test-course')

  expect(warn).toHaveBeenCalledTimes(1)
  const message = String(warn.mock.calls[0]?.[0] ?? '')
  expect(message).toContain('test-course')
  expect(message).toContain('fr')
})
