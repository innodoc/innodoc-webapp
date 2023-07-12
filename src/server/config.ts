import path from 'path'
import { fileURLToPath } from 'url'

import {
  COURSE_SLUG_MODES,
  DEFAULT_PAGE_PATH_PREFIX,
  DEFAULT_SECTION_PATH_PREFIX,
} from '#constants'
import type { CourseSlugMode } from '#types/common'
import loadDotEnv from '#utils/loadDotEnv'

let rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
if (process.env.NODE_ENV !== 'production') {
  rootDir = path.resolve(rootDir, '..')
}

loadDotEnv(path.resolve(rootDir))

function isCourseSlugMode(mode: string | undefined): mode is CourseSlugMode {
  return mode !== undefined && COURSE_SLUG_MODES.includes(mode as CourseSlugMode)
}

if (process.env.DB_CONNECTION === undefined) {
  throw new Error('You need to set the env variable DB_CONNECTION.')
}

if (process.env.INNODOC_COURSE_SLUG_MODE === undefined) {
  throw new Error('You need to set the env variable INNODOC_COURSE_SLUG_MODE.')
}

if (process.env.INNODOC_DEFAULT_COURSE_SLUG === undefined) {
  throw new Error('You need to set the env variable INNODOC_DEFAULT_COURSE_SLUG.')
}

if (process.env.INNODOC_APP_ROOT === undefined) {
  throw new Error('You need to set the env variable INNODOC_APP_ROOT.')
}

const config: ServerConfig = {
  host: process.env.SERVER_HOST || 'localhost',
  port: parseInt(process.env.SERVER_PORT || '3000'),
  appRoot: process.env.INNODOC_APP_ROOT,
  isProduction: process.env.NODE_ENV === 'production',
  rootDir,
  distDir: path.join(rootDir, 'dist', 'client'),
  dbConnection: process.env.DB_CONNECTION,
  dbDebug: process.env.DB_DEBUG === 'true',
  courseSlugMode: isCourseSlugMode(process.env.INNODOC_COURSE_SLUG_MODE)
    ? process.env.INNODOC_COURSE_SLUG_MODE
    : 'DISABLE',
  defaultCourseSlug: process.env.INNODOC_DEFAULT_COURSE_SLUG,
  enableMockApi: process.env.INNODOC_API_MOCK === 'true',
  pagePathPrefix: process.env.INNODOC_PAGE_PATH_PREFIX ?? DEFAULT_PAGE_PATH_PREFIX,
  sectionPathPrefix: process.env.INNODOC_SECTION_PATH_PREFIX ?? DEFAULT_SECTION_PATH_PREFIX,
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

  /** Page path prefix */
  pagePathPrefix: string

  /** Section path prefix */
  sectionPathPrefix: string
}

export default config
