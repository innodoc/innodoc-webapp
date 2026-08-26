import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import iconBundle from '#icon-bundle'

/**
 * Build the production icon bundle JSON from the `ICON_NAMES` manifest
 * (see `src/icon-bundle.ts` for resolution details).
 *
 * Run with `--conditions=development` so `#icon-bundle` resolves to the
 * development module (manifest + MDI icon set) instead of a prebuilt JSON.
 */
const distDir = path.resolve(import.meta.dirname, '..', 'dist')
await mkdir(distDir, { recursive: true })
await writeFile(path.join(distDir, 'icon-bundle.json'), JSON.stringify(iconBundle))
