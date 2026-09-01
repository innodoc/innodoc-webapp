import { expect, test } from 'vitest'
import { isTranslatableString } from './content.js'

test('isTranslatableString accepts a record of locale keys with string values', () => {
  expect(isTranslatableString({ en: 'Hello', de: 'Hallo' })).toBe(true)
})

test('isTranslatableString rejects a wrong locale key or a non-string value', () => {
  // The verdict is identity-cached for performance, but only ever *positive*: a malformed
  // record is rejected (and re-checked) on every call, so nothing untrusted slips through.
  expect(isTranslatableString({ en: 'Hello', 123: 'Hallo' })).toBe(false)
  expect(isTranslatableString({ en: 'Hello', de: 42 })).toBe(false)
})

test('isTranslatableString rejects non-objects', () => {
  expect(isTranslatableString(null)).toBe(false)
  expect(isTranslatableString('en')).toBe(false)
  expect(isTranslatableString(42)).toBe(false)
})
