import z from 'zod'

import {
  COURSE_SLUG_MODES,
  DEFAULT_COURSE_SLUG_MODE,
  DEFAULT_PAGE_PATH_PREFIX,
  DEFAULT_SECTION_PATH_PREFIX,
} from '@innodoc/constants'

import { hostnameSchema, portSchema, slugSchema } from './common'

const configSchema = z
  .object({
    // App server
    host: hostnameSchema.default('localhost').describe('Hostname to listen on'),
    port: portSchema.default(3000).describe('Port to listen on'),

    // App configuration
    appRoot: z
      .string()
      .url()
      .default('http://localhost/')
      .describe('Application base URL (URL the app will be available from the outside'),
    isProduction: z.boolean().default(false).describe("If we're running in production mode"),
    rootDir: z.string().describe('Project root directory path'),
    distDir: z.string().describe('Project dist directory path'),
    pagePathPrefix: slugSchema
      .default(DEFAULT_PAGE_PATH_PREFIX)
      .describe('URL path component for pages'),
    sectionPathPrefix: slugSchema
      .default(DEFAULT_SECTION_PATH_PREFIX)
      .describe('URL path component for sections'),
    jwtSecret: z
      .string()
      .describe("JWT secret (generate with `openssl rand -base64 256 | tr -d '\n'`"),
    dbConnectionString: z
      .string()
      .url()
      .startsWith('postgresql://', 'Not a valid PostgreSQL connection string')
      .describe('Database connection string (only PostgreSQL supported)'),

    // Course configuration
    courseSlugMode: z
      .enum(COURSE_SLUG_MODES)
      .default(DEFAULT_COURSE_SLUG_MODE)
      .describe(
        `Course slug mode (${COURSE_SLUG_MODES.join(', ')}, default=${DEFAULT_COURSE_SLUG_MODE})`,
      ),
    defaultCourseSlug: slugSchema.nullable().describe('Default course slug'),

    // Mailer configuration
    smtpHost: hostnameSchema.describe('SMTP hostname'),
    smtpPort: portSchema.describe('SMTP port'),
    smtpUser: z.string().describe('SMTP username'),
    smtpPassword: z.string().describe('SMTP password'),
    smtpSender: z.string().email().describe('SMTP password'),

    // Discourse integration
    discourseUrl: z.string().url().nullable().describe('Discourse URL'),
    discourseSsoSecret: z.string().nullable().describe('Discourse SSO secret'),

    // Development options
    dbDebug: z.boolean().default(false).describe('Print database debug output'),
    enableMockApi: z.boolean().default(false).describe('Enable mock API'),
    skipMails: z.boolean().default(false).describe("Don't send out any mails"),
  })
  .refine((configObj) => configObj.courseSlugMode !== 'DISABLE' || configObj.defaultCourseSlug, {
    message: 'Need a default course slug if course slug mode is disabled.',
  })
  .describe('innoDoc application configuration')

type ConfigSchema = z.infer<typeof configSchema>

export type { ConfigSchema }
export { configSchema }
