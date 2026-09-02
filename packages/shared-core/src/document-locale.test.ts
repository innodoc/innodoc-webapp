import { expect, test } from 'vitest'
import { resolveDocumentLocale, uiLocales } from './document-locale.js'

test('uiLocales keeps the renderable locales and drops the cimode marker', () => {
  expect(uiLocales(['de', 'en', 'cimode'])).toEqual(['de', 'en'])
  expect(uiLocales(['en'])).toEqual(['en'])
  expect(uiLocales(['cimode'])).toEqual([])
})

test('uiLocales answers an empty set when there is nothing to filter', () => {
  expect(uiLocales([])).toEqual([])
  expect(uiLocales(false)).toEqual([])
})

test('the document locale is the URL locale when a UI bundle exists for it', () => {
  expect(resolveDocumentLocale('de', ['de', 'en'])).toBe('de')
  expect(resolveDocumentLocale('en', ['de', 'en'])).toBe('en')
})

test('the document locale is the default when the URL locale has no UI bundle', () => {
  // A valid ISO 639-1 code the deployment does not publish
  expect(resolveDocumentLocale('fr', ['de', 'en'])).toBe('en')
  expect(resolveDocumentLocale('de', [])).toBe('en')
})
