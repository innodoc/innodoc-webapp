import fs from 'fs/promises'
import path from 'path'

import { fetchManifest } from '#server/content/fetch'

import getIconBundle from './getIconBundle'
import getLogo from './getLogo'

const BUILD_DIRNAME = path.resolve(__dirname, '..', 'build')
const ICON_BUNDLE_FILENAME = path.join(BUILD_DIRNAME, 'iconBundle.json')
const LOCALE_FILENAME = path.join(BUILD_DIRNAME, 'locales.json')
const LOGO_FILENAME = path.join(BUILD_DIRNAME, 'Logo.tsx')

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

  // TODO: use getConfig from server to be more DRY
  const contentRoot = process.env.INNODOC_CONTENT_ROOT
  if (contentRoot === undefined) {
    throw new Error('You need to set the env variable INNODOC_CONTENT_ROOT.')
  }

  const manifest = await fetchManifest(contentRoot)

  const iconBundle = await getIconBundle(manifest)
  await fs.writeFile(ICON_BUNDLE_FILENAME, JSON.stringify(iconBundle))
  console.log(`Wrote ${ICON_BUNDLE_FILENAME}`)

  await fs.writeFile(LOCALE_FILENAME, JSON.stringify(manifest.locales))
  console.log(`Wrote ${LOCALE_FILENAME}`)

  const logo = await getLogo(manifest)
  await fs.writeFile(LOGO_FILENAME, logo)
  console.log(`Wrote ${LOGO_FILENAME}`)
}

export default buildData
