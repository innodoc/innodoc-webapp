#!/usr/bin/env node

import { InvalidArgumentError, program } from '@commander-js/extra-typings'
import { lstat, writeFile } from 'node:fs/promises'
import getIconBundle from './get-icon-bundle.js'

interface SystemError extends Error {
  code: string
}

function isSystemError(err: unknown): err is SystemError {
  return err instanceof Error && typeof (err as SystemError).code === 'string'
}

async function checkOutFile(outFile: string, force: boolean) {
  try {
    const outFileStats = await lstat(outFile)
    if (outFileStats.isFile() && !force) {
      throw new InvalidArgumentError(`Output file '${outFile}' exists. Call with --force to overwrite.`)
    }
  } catch (error) {
    if (!(isSystemError(error) && error.code === 'ENOENT')) {
      throw error
    }
  }
}

async function buildIconBundle({ force, output: outFile }: { force: boolean; output: string }) {
  await checkOutFile(outFile, force)
  const iconBundle = await getIconBundle()
  await writeFile(outFile, JSON.stringify(iconBundle))
}

program
  .name('innodoc-icon-bundle')
  .description('Build the icon bundle JSON from the ICON_NAMES manifest in @innodoc/shared-core.')
  .requiredOption('-o, --output <output>', 'Output file')
  .option('-f, --force', 'Overwrite output file', false)
  .action(buildIconBundle)
  .parse()
