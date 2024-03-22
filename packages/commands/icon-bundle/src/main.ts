#!/usr/bin/env node

import { lstat, writeFile } from 'node:fs/promises'

import { InvalidArgumentError, program } from '@commander-js/extra-typings'

import getIconBundle from './getIconBundle.js'

interface SystemError extends Error {
  code: string
}

function isSystemError(err: unknown): err is SystemError {
  return err instanceof Error && typeof (err as SystemError).code === 'string'
}

async function checkSrcDir(srcDir: string) {
  try {
    const srcDirStats = await lstat(srcDir)
    if (!srcDirStats.isDirectory()) {
      throw new InvalidArgumentError(`${srcDir} is not a valid directory`)
    }
  } catch (error) {
    if (isSystemError(error) && error.code === 'ENOENT') {
      throw new InvalidArgumentError(`Source directory '${srcDir}' does not exist.`)
    }
    throw error
  }
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

async function buildIconBundle(srcDirs: string[], { force, output: outFile }: { force: boolean; output: string }) {
  for (const srcDir of srcDirs) {
    await checkSrcDir(srcDir)
  }
  await checkOutFile(outFile, force)
  await writeFile(outFile, JSON.stringify(await getIconBundle(srcDirs)))
}

program
  .name('innodoc-icon-bundle')
  .description('Scan source tree, extract icon names and build a JSON icon bundle.')
  .requiredOption('-o, --output <output>', 'Output file')
  .option('-f, --force', 'Overwrite output file', false)
  .argument('<dirs...>', 'source directories to scan')
  .action(buildIconBundle)
  .parse()
