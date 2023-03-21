import fs from 'fs/promises'
import path from 'path'

import getIconBundle from './getIconBundle'

interface SystemError extends Error {
  code: string
}

function isSystemError(err: unknown): err is SystemError {
  return err instanceof Error && typeof (err as SystemError).code === 'string'
}

async function buildIcons(projectDir: string) {
  const buildDir = path.resolve(projectDir, 'build')
  const iconBundleFilename = path.join(buildDir, 'iconBundle.json')

  try {
    await fs.mkdir(buildDir)
  } catch (err) {
    if (!isSystemError(err) || err.code !== 'EEXIST') {
      throw err
    }
  }

  const iconBundle = await getIconBundle(projectDir)
  await fs.writeFile(iconBundleFilename, JSON.stringify(iconBundle))
  console.log(`Wrote ${iconBundleFilename}`)
}

export default buildIcons
