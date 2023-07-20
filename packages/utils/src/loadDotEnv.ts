import path from 'path'

import dotenv from 'dotenv'

function loadDotEnv(baseDir: string) {
  const dotEnvFilepath = path.resolve(baseDir, process.env.VITEST_MODE ? '.env.test' : '.env')
  const { error } = dotenv.config({ path: dotEnvFilepath })
  if (error) {
    throw error
  }
}

export default loadDotEnv
