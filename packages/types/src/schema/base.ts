import isISO6391 from 'validator/lib/isISO6391'
import isSlug from 'validator/lib/isSlug'
import z from 'zod'

const slug = z.string().refine(isSlug, { message: 'String must be a slug' })
const locale = z.string().refine(isISO6391, { message: 'String must be a valid locale' })
const translatableString = z.record(locale, z.string())

const baseEntity = z.object({
  id: z.number().int().positive().describe('Primary key'),
  created_at: z.date().describe('Creation date (ISO8601)'),
  updated_at: z.date().describe('Update date (ISO8601)'),
})

export { baseEntity, locale, slug, translatableString }
