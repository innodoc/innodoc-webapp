import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { fromZodError } from 'zod-validation-error'
import type { ZodError } from 'zod-validation-error'

import createLogger from '@innodoc/logging'
import { configSchema } from '@innodoc/schema/config'
import { isArbitraryObject } from '@innodoc/utils/typeGuards'

import loadDotEnv from './loadDotEnv'

function isZodError(thing: unknown): thing is ZodError {
  return isArbitraryObject(thing) && Array.isArray(thing.issues)
}

/**
 * Construct config object from env variables.
 *
 * Prints errors and exits program if configuration could not be parsed.
 *
 * @returns Config object
 */
function parseConfig() {
  let rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
  if (process.env.NODE_ENV !== 'production') {
    rootDir = path.resolve(rootDir, '..')
  }

  loadDotEnv(path.resolve(rootDir))

  if (process.env.INNODOC_APP_ROOT === undefined) {
    throw new Error('You need to set the env variable INNODOC_APP_ROOT.')
  }

  try {
    return configSchema.parse({
      host: process.env.INNODOC_HOST,
      port: process.env.INNODOC_PORT,

      appRoot: process.env.INNODOC_APP_ROOT,
      isProduction: process.env.NODE_ENV === 'production',
      rootDir,
      distDir: path.join(rootDir, 'dist', 'client'),
      pagePathPrefix: process.env.INNODOC_PAGE_PATH_PREFIX,
      sectionPathPrefix: process.env.INNODOC_SECTION_PATH_PREFIX,
      jwtSecret: process.env.INNODOC_JWT_SECRET,
      dbConnectionString: process.env.INNODOC_DB_CONNECTION,

      courseSlugMode: process.env.INNODOC_COURSE_SLUG_MODE,
      defaultCourseSlug: process.env.INNODOC_DEFAULT_COURSE_SLUG,

      smtpHost: process.env.INNODOC_SMTP_HOST,
      smtpPort: process.env.INNODOC_SMTP_PORT,
      smtpUser: process.env.INNODOC_SMTP_USER,
      smtpPassword: process.env.INNODOC_SMTP_PASSWORD,
      smtpSender: process.env.INNODOC_SMTP_SENDER,

      discourseUrl: process.env.INNODOC_DISCOURSE_URL,
      discourseSsoSecret: process.env.INNODOC_DISCOURSE_SSO_SECRET,

      dbDebug: process.env.INNODOC_DB_DEBUG === 'true',
      enableMockApi: process.env.INNODOC_API_MOCK === 'true',
      skipMails: process.env.INNODOC_SMTP_SKIP_MAILS === 'true',
    })
  } catch (err) {
    if (!isZodError(err)) {
      throw err
    }

    const validationError = fromZodError(err)
    createLogger('config').error(`Unable to read configuration: ${validationError.toString()}`)
    process.exit(-1)
  }
}

const config = parseConfig()

export default config
