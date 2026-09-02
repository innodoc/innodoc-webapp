import { expect, test } from 'vitest'
import { NOT_YET_TRANSLATED_CONTENT } from '@innodoc/shared-core/sentinels'
import type { TranslatedCourse, TranslatedPage } from '@innodoc/shared-core/types'
import { isContentNotYetTranslated } from './ContentPage.js'

/**
 * The predicate only reads `course.locales` and the definedness of `entity`, so a minimal
 * explicitly typed input is enough and keeps the test independent of the fixture shape.
 */
const course = { locales: ['en', 'de'] } as unknown as TranslatedCourse
const page = { id: 1 } as unknown as TranslatedPage

// The shapes the predicate reads: a stale cache entry from another state and the content
// query's error shapes (the fetch error of fetchBaseQuery carries the HTTP status)
const staleData = { content: 'stale content from another state', hash: 'stale' }
const notFoundError = { status: 404 }
const networkError = { status: 'FETCH_ERROR' }

// The 404 of the content query is conclusive: even a stale data entry for the same key belongs
// to another state, so it must not mask the translation gap (the client's transition flake).
test('a 404 in a declared locale is a translation gap even with stale data in the cache', () => {
  expect(isContentNotYetTranslated({ course, entity: page, locale: 'de', data: staleData, error: notFoundError })).toBe(
    true,
  )
})

test('a 404 without cached data in a declared locale is a translation gap', () => {
  expect(isContentNotYetTranslated({ course, entity: page, locale: 'de', data: undefined, error: notFoundError })).toBe(
    true,
  )
})

// The server seeds this sentinel for a declared locale without a content row (SSR).
test('the not-yet-translated sentinel without an error is a translation gap', () => {
  expect(
    isContentNotYetTranslated({
      course,
      entity: page,
      locale: 'de',
      data: NOT_YET_TRANSLATED_CONTENT,
      error: undefined,
    }),
  ).toBe(true)
})

test('real content without an error is not a translation gap', () => {
  expect(isContentNotYetTranslated({ course, entity: page, locale: 'de', data: staleData, error: undefined })).toBe(
    false,
  )
})

// A transient failure keeps the error states of today.
test('a non-404 query error is not a translation gap', () => {
  expect(isContentNotYetTranslated({ course, entity: page, locale: 'de', data: undefined, error: networkError })).toBe(
    false,
  )
})

// A page the course does not list is a genuine not-found, whatever the error says.
test('a page the course does not list is not a translation gap', () => {
  expect(
    isContentNotYetTranslated({ course, entity: undefined, locale: 'de', data: undefined, error: notFoundError }),
  ).toBe(false)
})

// A locale the course does not declare redirects (SSR) or errors (client) - never the gap state.
test('a locale the course does not declare is not a translation gap', () => {
  const enOnlyCourse = { ...course, locales: ['en'] }
  expect(
    isContentNotYetTranslated({
      course: enOnlyCourse,
      entity: page,
      locale: 'de',
      data: undefined,
      error: notFoundError,
    }),
  ).toBe(false)
})
