import fs from 'fs/promises'
import path from 'path'

import fetchManifest from '../src/utils/fetchManifest'

import getIconBundle from './getIconBundle'
import getLogo from './getLogo'

const BUILD_DATA_FILE = path.resolve(__dirname, '..', 'src', '__buildData.json')

async function buildData() {
  const manifest = await fetchManifest()

  const iconBundle = await getIconBundle(manifest)
  const locales = manifest.languages
  const logoData = await getLogo(manifest)

  await fs.writeFile(BUILD_DATA_FILE, JSON.stringify({ iconBundle, locales, logoData }))
  console.log(`Wrote ${BUILD_DATA_FILE}`)
}

export default buildData
