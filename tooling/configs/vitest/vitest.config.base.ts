import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(dirname, '..', '..', '..')

export default defineConfig({
  envDir: rootDir,
  // Mirror the client build's namespace so component tests see the same `INNODOC_PUBLIC_*` set the
  // browser does. Server-only `INNODOC_*` secrets are loaded separately by `parse-config`.
  envPrefix: 'INNODOC_PUBLIC_',
  test: {
    // A package that has no tests yet must not fail the workspace run - `pnpm test` is the gate CI
    // can lean on. The runner still logs "No test files found" for those, so the gap stays visible.
    passWithNoTests: true,
    watch: false,
  },
})
