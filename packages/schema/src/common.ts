import isFQDN from 'validator/lib/isFQDN'
import isIP from 'validator/lib/isIP'
import isLocale from 'validator/lib/isLocale'
import isPort from 'validator/lib/isPort'
import isSlug from 'validator/lib/isSlug'
import z from 'zod'

import { PATH_RE } from '@innodoc/constants'
import { isLanguageCode } from '@innodoc/utils/typeGuards'

function validateTranslatableString(obj: object) {
  return Object.entries(obj).every(([k, v]) => isLocale(k) && typeof v === 'string')
}

const sectionPathRegex = new RegExp(`^${PATH_RE}$`)
const isHostname = (val: string) => isIP(val) || isFQDN(val, { require_tld: false })
function isSectionPath(value: string) {
  return sectionPathRegex.test(value)
}

const slugSchema = z.string().refine(isSlug, { message: 'String must be a slug' })
const localeSchema = z.string().refine(isLanguageCode, { message: 'String must be a valid locale' })
const hostnameSchema = z.string().refine(isHostname, { message: 'Invalid hostname' })
const portSchema = z.coerce
  .number()
  .int()
  .refine((val) => isPort(`${val}`), { message: 'Invalid port' })

const translatableString = z
  .record(localeSchema, z.string())
  .refine(validateTranslatableString, { message: 'Translatable string malformed' })
const dbKey = z.number().int().positive()
const orderNumber = z.number().int().describe('Sort order within parent')
const sectionPathSchema = z
  .string()
  .refine(isSectionPath, { message: 'String must be a valid section path' })

export {
  dbKey,
  hostnameSchema,
  localeSchema,
  orderNumber,
  portSchema,
  sectionPathSchema,
  slugSchema,
  translatableString,
  validateTranslatableString,
}
