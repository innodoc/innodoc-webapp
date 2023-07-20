import type { CourseSlugMode } from './common'

interface ServerConfig {
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

export default ServerConfig
