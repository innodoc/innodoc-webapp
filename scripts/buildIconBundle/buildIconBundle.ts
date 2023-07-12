import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

import getIconBundle from './getIconBundle'

interface SystemError extends Error {
  code: string
}

function isSystemError(err: unknown): err is SystemError {
  return err instanceof Error && typeof (err as SystemError).code === 'string'
}

async function buildIconBundle(projectDir: string) {
  const distDir = path.resolve(projectDir, 'dist')
  const iconBundleFilename = path.join(distDir, 'iconBundle.json')

  try {
    await fs.mkdir(distDir)
  } catch (err) {
    if (!isSystemError(err) || err.code !== 'EEXIST') {
      throw err
    }
  }

  const iconBundle = await getIconBundle(projectDir)
  await fs.writeFile(iconBundleFilename, JSON.stringify(iconBundle))

  return iconBundleFilename
}

buildIconBundle(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..'))
  .then((iconBundleFilename) => {
    console.log(`Wrote ${iconBundleFilename}`)
    return undefined
  })
  .catch((err) => {
    console.error('Failed to write icon bundle!')
    console.error(err)
    process.exit(-1)
  })
