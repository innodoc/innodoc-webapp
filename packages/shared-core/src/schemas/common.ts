import isFQDN from 'validator/lib/isFQDN.js'
import isIP from 'validator/lib/isIP.js'
import isLocale from 'validator/lib/isLocale.js'
import isPort from 'validator/lib/isPort.js'
import isSlug from 'validator/lib/isSlug.js'
import z from 'zod'
import { PATH_RE } from '#constants'

// split off, so we don't create a circular typing on `translatableString` schema
function validateTranslatableString(obj: object) {
  return Object.entries(obj).every(([k, v]) => isLocale(k) && typeof v === 'string')
}

const sectionPathRegex = new RegExp(`^${PATH_RE}$`, 'u')
const isHostname = (val: string) => isIP(val) || isFQDN(val, { require_tld: false })
function isSectionPath(value: string) {
  return sectionPathRegex.test(value)
}

const iconNameSchema = z.string().describe('Icon name')
const slugSchema = z.string().refine(isSlug, { message: 'String must be a slug' })
const localeSchema = z.string().refine(isLocale, { message: 'String must be a valid locale' })
const hostnameSchema = z.string().refine(isHostname, { message: 'Invalid hostname' })
const portSchema = z.coerce
  .number()
  .int()
  .refine((val) => isPort(String(val)), { message: 'Invalid port' })

const translatableString = z
  .record(localeSchema, z.string())
  .refine(validateTranslatableString, { message: 'Translatable string malformed' })
const dbKeySchema = z.number().int().positive()
const orderNumber = z.number().int().describe('Sort order within parent')
const sectionPathSchema = z.string().refine(isSectionPath, { message: 'String must be a valid section path' })

export {
  dbKeySchema,
  hostnameSchema,
  iconNameSchema,
  localeSchema,
  orderNumber,
  portSchema,
  sectionPathSchema,
  slugSchema,
  translatableString,
  validateTranslatableString,
}
