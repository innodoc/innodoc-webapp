// Generate compilerOptions.paths in tsconfig.json from package.json imports
// field which is the source of truth.

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

import type { TsConfigOptions } from 'ts-node'

import type packageJson from '../package.json'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const tsConfigPath = path.resolve(__dirname, '..', 'tsconfig.json')

void generate()

async function generate() {
  const tsConfigData = await fs.readFile(tsConfigPath)
  const tsConfig = JSON.parse(tsConfigData.toString()) as TsConfigOptions

  const packageInfoData = await fs.readFile(path.resolve(__dirname, '..', 'package.json'))
  const { imports } = JSON.parse(packageInfoData.toString()) as typeof packageJson

  const tsConfigNew = {
    ...tsConfig,
    compilerOptions: {
      ...tsConfig.compilerOptions,
      paths: Object.fromEntries(Object.entries(imports).map(([key, val]) => [key, [val]])),
    },
  }

  await fs.writeFile(tsConfigPath, JSON.stringify(tsConfigNew, undefined, 2))
}
