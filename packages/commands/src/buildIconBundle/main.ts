import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import getIconBundle from './getIconBundle'

interface SystemError extends Error {
  code: string
}

function isSystemError(err: unknown): err is SystemError {
  return err instanceof Error && typeof (err as SystemError).code === 'string'
}

async function buildIconBundle() {
  const dirname = path.dirname(fileURLToPath(import.meta.url))
  const packageDir = path.resolve(dirname, '..', '..')
  const projectDir = path.resolve(dirname, '..', '..', '..', '..')
  const distDir = path.resolve(packageDir, 'dist')
  const iconBundleFilename = path.join(distDir, 'iconBundle.json')

  try {
    await fs.mkdir(distDir)
  } catch (error) {
    if (!isSystemError(error) || error.code !== 'EEXIST') {
      throw error
    }
  }

  const iconBundle = await getIconBundle(projectDir)
  await fs.writeFile(iconBundleFilename, JSON.stringify(iconBundle))

  return iconBundleFilename
}

buildIconBundle()
  .then((iconBundleFilename) => {
    console.log(`Wrote ${iconBundleFilename}`)
    return
  })
  .catch((error) => {
    console.error('Failed to write icon bundle!')
    console.error(error)
    process.exit(-1)
  })
