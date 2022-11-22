import path from 'path'
import { fileURLToPath } from 'url'

import dotenv from 'dotenv'

import type { ApiManifest } from '#types/api'

import { fetchManifest } from './content/fetch'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..', '..')

// Load .env config
dotenv.config({ path: path.resolve(rootDir, '.env') })

let config: ServerConfig

async function getConfig(): Promise<ServerConfig> {
  if (config !== undefined) {
    return config
  }

  if (process.env.INNODOC_CONTENT_ROOT === undefined) {
    throw new Error('You need to set the env variable INNODOC_CONTENT_ROOT.')
  }
  const contentRoot = process.env.INNODOC_CONTENT_ROOT

  config = {
    host: process.env.SERVER_HOST || 'localhost',
    port: parseInt(process.env.SERVER_PORT || '3000'),
    isProduction: process.env.NODE_ENV === 'production',
    contentRoot,
    rootDir,
    distDir: path.join(rootDir, 'dist'),
    manifest: await fetchManifest(contentRoot),
  }

  return config
}

export type ServerConfig = {
  /** Server host */
  host: string
  /** Server port */
  port: number
  /** Is production environment */
  isProduction: boolean
  /** Content root URL */
  contentRoot: string
  /** Project root directory */
  rootDir: string
  /** Dist directory */
  distDir: string
  /** Course manifest */
  manifest: ApiManifest
}

export default getConfig
