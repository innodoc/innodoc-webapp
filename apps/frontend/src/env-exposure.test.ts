/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'
import { expect, test } from 'vitest'

/**
 * The namespace the client build may expose. Written as a literal so a change to
 * `apps/frontend/vite.config.ts` has to be made twice, and the first test says why.
 */
const PUBLIC_ENV_PREFIX = 'INNODOC_PUBLIC_'

/** Matches `import.meta.env` used as an object instead of `import.meta.env.SOME_KEY`. */
const BARE_IMPORT_META_ENV = /import\.meta\.env(?!\s*\.)/gu

/** Matches an `import.meta.env.INNODOC_*` read, capturing the variable name. */
const INNODOC_ENV_READ = /import\.meta\.env\.(INNODOC_[A-Z0-9_]+)/gu

/** Names that must never be readable from the browser. */
const SECRET_NAME = /SECRET|PASSWORD|PASSWD|TOKEN|CREDENTIAL|PRIVATE_KEY|API_KEY|DB_CONNECTION|DSN/u

const SOURCE_EXT = /\.(?:tsx?|jsx?|mjs|cjs)$/u

/**
 * Code that can reach the browser: the frontend source plus every workspace package that is not
 * Node-only (`packages/server-*`, which may read secrets). See the package dependency rules in
 * AGENTS.md.
 */
function clientSourceRoots(repoRoot: string): string[] {
  const packageDirs = listDirectories(path.join(repoRoot, 'packages')).filter(
    (dir) => !path.basename(dir).startsWith('server-'),
  )
  return [path.join(repoRoot, 'apps', 'frontend', 'src'), ...packageDirs].filter((dir) => fs.existsSync(dir))
}

function listDirectories(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return []
  }
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== 'dist' && entry.name !== 'node_modules')
    .map((entry) => path.join(dir, entry.name))
}

function collectSourceFiles(dir: string): string[] {
  const nested = listDirectories(dir).flatMap((subdir) => collectSourceFiles(subdir))
  const here = fs
    .readdirSync(dir)
    .filter((name) => SOURCE_EXT.test(name))
    .map((name) => path.join(dir, name))
  return [...nested, ...here]
}

function findRepoRoot(): string {
  let dir = path.dirname(fileURLToPath(import.meta.url))
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, 'pnpm-workspace.yaml'))) {
      return dir
    }
    dir = path.dirname(dir)
  }
  throw new Error('Could not locate the repository root from the frontend test')
}

const repoRoot = findRepoRoot()

test('the client build exposes only the public namespace', () => {
  const viteConfig = fs.readFileSync(path.join(repoRoot, 'apps', 'frontend', 'vite.config.ts'), 'utf8')
  const declared = [...viteConfig.matchAll(/envPrefix:\s*'([^']*)'/gu)].map((match) => match[1] ?? '')

  expect(declared).toEqual([PUBLIC_ENV_PREFIX])
})

test('no secret-shaped variable is readable from the browser', () => {
  const exposed = loadEnv('production', repoRoot, PUBLIC_ENV_PREFIX)
  const secrets = Object.keys(exposed).filter((key) => key.startsWith('INNODOC_') && SECRET_NAME.test(key))

  expect(secrets).toEqual([])
})

test('client code reads only public variables', () => {
  const offenders: string[] = []

  for (const root of clientSourceRoots(repoRoot)) {
    for (const file of collectSourceFiles(root)) {
      if (file.includes(`${path.sep}env-exposure.test.`)) {
        continue
      }
      const source = fs.readFileSync(file, 'utf8')
      const relativePath = path.relative(repoRoot, file)

      for (const match of source.matchAll(BARE_IMPORT_META_ENV)) {
        offenders.push(`${relativePath} uses \`${match[0]}\` as an object, inlining every exposed variable`)
      }
      for (const match of source.matchAll(INNODOC_ENV_READ)) {
        const name = match[1]
        if (name && !name.startsWith(PUBLIC_ENV_PREFIX)) {
          offenders.push(`${relativePath} reads the non-public \`${name}\` from the client`)
        }
      }
    }
  }

  expect(offenders).toEqual([])
})
