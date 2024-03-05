import dotenv from 'dotenv'
import path from 'path'

function loadDotEnv(baseDir: string) {
  const extraDotEnv = process.env.VITEST_MODE ? '.env.test' : '.env.local'
  const dotenvPaths = [extraDotEnv, '.env'].map((filename) => path.resolve(baseDir, filename))
  const { error } = dotenv.config({ path: dotenvPaths })
  if (error) {
    throw error
  }
}

export default loadDotEnv
