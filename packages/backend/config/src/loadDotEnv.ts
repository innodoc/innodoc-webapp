import path from 'node:path'

import dotenv from 'dotenv'

// TODO: use "import { loadEnv } from 'vite'"?

function loadDotEnv(baseDir: string) {
  const extraDotEnv = process.env.VITEST === 'true' ? '.env.test' : '.env.local'
  const dotenvPaths = [extraDotEnv, '.env'].map((filename) => path.resolve(baseDir, filename))
  const { error } = dotenv.config({ path: dotenvPaths })
  if (error) {
    throw error
  }
}

export default loadDotEnv
