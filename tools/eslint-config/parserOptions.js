import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const parserOptions = {
  project: ['./packages/*/*/tsconfig*.json'],
  tsconfigRootDir: resolve(dirname(fileURLToPath(import.meta.url)), '..', '..'),
}

export default parserOptions
