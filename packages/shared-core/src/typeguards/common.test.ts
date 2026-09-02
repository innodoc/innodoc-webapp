import { expect, test } from 'vitest'
import { isLocale } from './common.js'

test('isLocale accepts ISO 639-1 two-letter codes', () => {
  expect(isLocale('de')).toBe(true)
  expect(isLocale('en')).toBe(true)
  expect(isLocale('fr')).toBe(true)
})

test('isLocale rejects strings outside the ISO 639-1 domain', () => {
  expect(isLocale('xx')).toBe(false)
  expect(isLocale('dev')).toBe(false)
  expect(isLocale('cimode')).toBe(false)
  expect(isLocale('en_US')).toBe(false)
  expect(isLocale('EN')).toBe(false)
  expect(isLocale('')).toBe(false)
})

test('isLocale rejects non-strings', () => {
  expect(isLocale(123)).toBe(false)
  expect(isLocale(null)).toBe(false)
  expect(isLocale({})).toBe(false)
})
