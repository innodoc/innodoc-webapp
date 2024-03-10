#!/usr/bin/env tsx

import fs from 'node:fs/promises'
import path from 'node:path'

import config from '@innodoc/config'

import getIconBundle from './getIconBundle'

interface SystemError extends Error {
  code: string
}

function isSystemError(err: unknown): err is SystemError {
  return err instanceof Error && typeof (err as SystemError).code === 'string'
}

async function buildIconBundle() {
  try {
    const distDir = path.resolve(config.rootDir, 'packages', 'icon-bundle', 'dist')
    try {
      await fs.mkdir(distDir)
    } catch (error) {
      if (!isSystemError(error) || error.code !== 'EEXIST') {
        throw error
      }
    }

    const uiPackageDir = path.resolve(config.rootDir, 'packages', 'ui')
    const iconBundle = await getIconBundle(uiPackageDir)

    const iconBundleFilename = path.join(distDir, 'iconBundle.json')
    await fs.writeFile(iconBundleFilename, JSON.stringify(iconBundle))
    console.log(`Wrote ${iconBundleFilename}`)
  } catch (error) {
    console.error('Failed to write icon bundle!')
    console.error(error)
    process.exit(-1)
  }
}

await buildIconBundle()
