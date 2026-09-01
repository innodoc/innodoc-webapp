import { expect, test } from 'vitest'
import type { ApiBaseEntity, TranslatableString } from '#types'
import { translateEntity, translateEntityArray } from './translate.js'

/** Entity covering the three value classes `translateEntity` distinguishes */
interface TestEntity extends ApiBaseEntity {
  /** Translatable title */
  title: TranslatableString
  /** Non-translatable string field (the API's dates travel as JSON strings, just like this) */
  slug: string
  /** Non-translatable array field */
  order: number[]
}

const entity: TestEntity = {
  id: 1,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-02T00:00:00.000Z'),
  title: { de: 'Kurs zum Testen', en: 'Course for testing' },
  slug: 'test-course',
  order: [1, 2],
}

test('translateEntity picks the locale string for translatable fields', () => {
  expect(translateEntity(entity, 'en').title).toBe('Course for testing')
  expect(translateEntity(entity, 'de').title).toBe('Kurs zum Testen')
})

test('translateEntity returns null when the locale is missing', () => {
  const enOnly: TestEntity = { ...entity, title: { en: 'Course for testing' } }

  expect(translateEntity(enOnly, 'de').title).toBeNull()
})

test('translateEntity leaves non-translatable fields untouched', () => {
  const translated = translateEntity(entity, 'en')

  expect(translated.id).toBe(1)
  expect(translated.slug).toBe('test-course')
  expect(translated.order).toBe(entity.order) // same reference, not re-created
})

test('values with no enumerable keys are misclassified as translatable - pinned for schema-driven translation', () => {
  // `validateTranslatableString` is `Object.entries(x).every(...)` - vacuously true for key-less
  // objects, so a Date translates to null. Production never feeds Dates in (fetchBaseQuery hands
  // over JSON, where dates are strings), but any object-valued field would meet the same fate.
  // Schema-driven translation is the fix; this test is its acceptance anchor.
  expect(translateEntity(entity, 'en').createdAt).toBeNull()
})

test('translateEntityArray translates every element', () => {
  const translated = translateEntityArray([entity, { ...entity, id: 2 }], 'de')

  expect(translated.map((e) => e.title)).toEqual(['Kurs zum Testen', 'Kurs zum Testen'])
})
