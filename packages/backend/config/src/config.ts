import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { loadEnv } from 'vite'

import { configSchema } from '@innodoc/schema/config'

/**
 * Construct config object from env variables.
 *
 * Prints errors and exits program if configuration could not be parsed.
 *
 * @returns Config object
 */
function parseConfig() {
  const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..')
  const env = loadEnv(process.env.NODE_ENV ?? 'development', rootDir, '')

  if (env.INNODOC_APP_ROOT === undefined) {
    throw new Error('You need to set the env variable INNODOC_APP_ROOT.')
  }

  return configSchema.parse({
    host: env.INNODOC_HOST,
    port: env.INNODOC_PORT,

    appRoot: env.INNODOC_APP_ROOT,
    isProduction: env.NODE_ENV === 'production',
    rootDir,
    distDir: path.join(rootDir, 'dist', 'client'),
    pagePathPrefix: env.INNODOC_PAGE_PATH_PREFIX,
    sectionPathPrefix: env.INNODOC_SECTION_PATH_PREFIX,
    jwtSecret: env.INNODOC_JWT_SECRET,
    dbConnectionString: env.INNODOC_DB_CONNECTION,

    courseSlugMode: env.INNODOC_COURSE_SLUG_MODE,
    defaultCourseSlug: env.INNODOC_DEFAULT_COURSE_SLUG,

    smtpHost: env.INNODOC_SMTP_HOST,
    smtpPort: env.INNODOC_SMTP_PORT,
    smtpUser: env.INNODOC_SMTP_USER,
    smtpPassword: env.INNODOC_SMTP_PASSWORD,
    smtpSender: env.INNODOC_SMTP_SENDER,

    discourseUrl: env.INNODOC_DISCOURSE_URL,
    discourseSsoSecret: env.INNODOC_DISCOURSE_SSO_SECRET,

    dbDebug: env.INNODOC_DB_DEBUG === 'true',
    enableMockApi: env.INNODOC_API_MOCK === 'true',
    skipMails: env.INNODOC_SMTP_SKIP_MAILS === 'true',
  })
}

const config = parseConfig()

export default config
