import { expect, test } from 'vitest'
import { localeSchema, querySectionSchema, translatableString } from '#schemas'

const section = {
  id: 1,
  created_at: new Date('2022-07-11T09:12:33.000Z'),
  updated_at: new Date('2022-09-01T11:12:33.000Z'),
  path: 'section-1',
  course_id: 1,
  parent_id: null,
  title: { en: 'Hello', de: 'Hallo' },
  short_title: null,
  type: 'regular',
  order: [1],
}

test('localeSchema accepts ISO 639-1 two-letter codes', () => {
  expect(localeSchema.safeParse('de').success).toBe(true)
  expect(localeSchema.safeParse('en').success).toBe(true)
  expect(localeSchema.safeParse('fr').success).toBe(true)
})

test('localeSchema rejects strings outside the ISO 639-1 domain', () => {
  expect(localeSchema.safeParse('xx').success).toBe(false)
  expect(localeSchema.safeParse('dev').success).toBe(false)
  expect(localeSchema.safeParse('cimode').success).toBe(false)
  expect(localeSchema.safeParse('en_US').success).toBe(false)
  expect(localeSchema.safeParse('EN').success).toBe(false)
  expect(localeSchema.safeParse('').success).toBe(false)
})

test('localeSchema rejects non-strings', () => {
  expect(localeSchema.safeParse(123).success).toBe(false)
  expect(localeSchema.safeParse(null).success).toBe(false)
})

test('translatableString accepts locale keys with string values', () => {
  expect(translatableString.safeParse({ en: 'Hello', de: 'Hallo' }).success).toBe(true)
})

test('translatableString rejects a wrong locale key or a non-string value', () => {
  expect(translatableString.safeParse({ en: 'Hello', 123: 'Hallo' }).success).toBe(false)
  expect(translatableString.safeParse({ en: 'Hello', de: 42 }).success).toBe(false)
})

test('querySectionSchema accepts a well-formed section', () => {
  expect(querySectionSchema.safeParse(section).success).toBe(true)
})

// The API serializer (apps/backend, camelcase.ts) runs the entity schemas with `safeParse` on
// every payload, so this is the boundary that keeps malformed translatable records out of the
// store - the runtime validation the identity cache stopped *repeating* on every translate pass.
test('querySectionSchema rejects a section whose title is malformed', () => {
  expect(querySectionSchema.safeParse({ ...section, title: { en: 'Hello', 123: 'Hallo' } }).success).toBe(false)
  expect(querySectionSchema.safeParse({ ...section, title: { en: 'Hello', de: 42 } }).success).toBe(false)
})
