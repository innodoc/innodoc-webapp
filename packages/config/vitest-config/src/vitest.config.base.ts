import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(dirname, '..', '..', '..', '..')

export default defineConfig({
  envDir: rootDir,
  test: {
    watch: false,
  },
})
