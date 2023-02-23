import path from 'path'
import { fileURLToPath } from 'url'

import dotenv from 'dotenv'

import { COURSE_SLUG_MODES } from '#constants'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..', '..')

// Load .env config
// TODO: parse .env.test and put into helper function that's used in vite config
dotenv.config({ path: path.resolve(rootDir, '.env') })

type CourseSlugMode = (typeof COURSE_SLUG_MODES)[number]

function isCourseSlugMode(mode: string | undefined): mode is CourseSlugMode {
  return mode !== undefined && COURSE_SLUG_MODES.includes(mode as CourseSlugMode)
}

if (process.env.DB_CONNECTION === undefined)
  throw new Error('You need to set the env variable DB_CONNECTION.')

if (process.env.COURSE_SLUG_MODE === undefined)
  throw new Error('You need to set the env variable COURSE_SLUG_MODE.')

if (process.env.DEFAULT_COURSE_SLUG === undefined)
  throw new Error('You need to set the env variable DEFAULT_COURSE_SLUG.')

if (process.env.INNODOC_APP_ROOT === undefined)
  throw new Error('You need to set the env variable INNODOC_APP_ROOT.')

const config: ServerConfig = {
  host: process.env.SERVER_HOST || 'localhost',
  port: parseInt(process.env.SERVER_PORT || '3000'),
  appRoot: process.env.INNODOC_APP_ROOT,
  isProduction: process.env.NODE_ENV === 'production',
  rootDir,
  distDir: path.join(rootDir, 'dist'),
  dbConnection: process.env.DB_CONNECTION,
  dbDebug: process.env.DB_DEBUG === 'true',
  courseSlugMode: isCourseSlugMode(process.env.COURSE_SLUG_MODE)
    ? process.env.COURSE_SLUG_MODE
    : 'DISABLE',
  defaultCourseSlug: process.env.DEFAULT_COURSE_SLUG,
  enableMockApi: process.env.INNODOC_API_MOCK === 'true',
}

export interface ServerConfig {
  /** Server host */
  host: string

  /** Server port */
  port: number

  /** Application base URL */
  appRoot: string

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

  /** Extract course slug from subdomain/url */
  courseSlugMode: CourseSlugMode

  /** Default course slug */
  defaultCourseSlug: string

  /** Enable mock API */
  enableMockApi: boolean
}

export default config
