import path from 'path'
import { fileURLToPath } from 'url'

import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..', '..')

// Load .env config
dotenv.config({ path: path.resolve(rootDir, '.env') })

if (process.env.DB_CONNECTION === undefined) {
  throw new Error('You need to set the env variable DB_CONNECTION.')
}

const config: ServerConfig = {
  host: process.env.SERVER_HOST || 'localhost',
  port: parseInt(process.env.SERVER_PORT || '3000'),
  isProduction: process.env.NODE_ENV === 'production',
  rootDir,
  distDir: path.join(rootDir, 'dist'),
  dbConnection: process.env.DB_CONNECTION,
  dbDebug: process.env.DB_DEBUG === 'true',
}

export interface ServerConfig {
  /** Server host */
  host: string
  /** Server port */
  port: number
  /** Is production environment */
  isProduction: boolean
  /** Project root directory */
  rootDir: string
  /** Dist directory */
  distDir: string
  /** Database connection string */
  dbConnection: string
  /** Database debug */
  dbDebug: boolean
}

export default config
