import fs from 'fs/promises'
import path from 'path'

import fetchManifest from '../src/utils/fetchManifest'

import getIconBundle from './getIconBundle'
import getLogo from './getLogo'

const BUILD_DIRNAME = path.resolve(__dirname, '..', 'src', '__build')
const ICON_BUNDLE_FILENAME = path.resolve(BUILD_DIRNAME, 'iconBundle.json')
const LOCALE_FILENAME = path.resolve(BUILD_DIRNAME, 'locales.json')
const LOGO_FILENAME = path.resolve(__dirname, '..', 'src', '__build', 'Logo.tsx')

interface SystemError extends Error {
  code: string
}

function isSystemError(err: unknown): err is SystemError {
  return err instanceof Error && typeof (err as SystemError).code === 'string'
}

async function buildData() {
  try {
    await fs.mkdir(BUILD_DIRNAME)
  } catch (err) {
    if (!isSystemError(err) || err.code !== 'EEXIST') {
      throw err
    }
  }

  const manifest = await fetchManifest()

  const iconBundle = await getIconBundle(manifest)
  await fs.writeFile(ICON_BUNDLE_FILENAME, JSON.stringify(iconBundle))
  console.log(`Wrote ${ICON_BUNDLE_FILENAME}`)

  await fs.writeFile(LOCALE_FILENAME, JSON.stringify(manifest.languages))
  console.log(`Wrote ${LOCALE_FILENAME}`)

  const logo = await getLogo(manifest)
  await fs.writeFile(LOGO_FILENAME, logo)
  console.log(`Wrote ${LOGO_FILENAME}`)
}

export default buildData
