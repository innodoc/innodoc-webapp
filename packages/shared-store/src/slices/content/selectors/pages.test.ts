import { assert, expect, test } from 'vitest'
import { EMPTY_TRANSLATED_PAGES } from '@innodoc/shared-core/sentinels'
import type { ApiPage } from '@innodoc/shared-core/types'
import { selectLinkedPages, selectPageBySlug, selectPageIndex } from '#slices/content/selectors/pages'

const createdAt = new Date('2024-01-01T00:00:00.000Z')
const updatedAt = new Date('2024-01-02T00:00:00.000Z')

function makePage(id: number, slug: string, linked: ApiPage['linked']): ApiPage {
  return {
    courseId: 1,
    createdAt,
    icon: null,
    id,
    linked,
    shortTitle: null,
    slug,
    title: { de: `Titel ${String(id)}`, en: `Title ${String(id)}` },
    updatedAt,
  }
}

const data: ApiPage[] = [
  makePage(1, 'home', ['nav', 'footer']),
  makePage(2, 'about', ['nav', 'footer']),
  makePage(3, 'imprint', ['footer']),
]

test('selectPageIndex translates each page once per (data, locale), no matter how many views ask', () => {
  selectPageIndex.resetRecomputations()

  selectLinkedPages(data, 'en', 'nav')
  selectLinkedPages(data, 'en', 'footer')
  selectPageBySlug(data, 'en', 'home')
  selectPageBySlug(data, 'en')

  expect(selectPageIndex.recomputations()).toBe(1)

  selectLinkedPages(data, 'de', 'nav')
  expect(selectPageIndex.recomputations()).toBe(2)
  selectLinkedPages(data, 'de', 'nav')
  expect(selectPageIndex.recomputations()).toBe(2)

  const fresh = data.map((page) => ({ ...page }))
  selectLinkedPages(fresh, 'en', 'nav')
  expect(selectPageIndex.recomputations()).toBe(3)
})

test('the flat views share one translated object per page', () => {
  expect(selectLinkedPages(data, 'en', 'nav')[0]).toBe(selectPageBySlug(data, 'en', 'home'))
  expect(selectLinkedPages(data, 'en', 'footer')[1]).toBe(selectPageBySlug(data, 'en', 'about'))
})

test('selectLinkedPages returns exactly the pages linked to a location, in API order, translated', () => {
  expect(selectLinkedPages(data, 'en', 'nav').map((p) => p.slug)).toEqual(['home', 'about'])
  expect(selectLinkedPages(data, 'en', 'footer').map((p) => p.slug)).toEqual(['home', 'about', 'imprint'])
  expect(selectLinkedPages(data, 'en', 'nav')[0]?.title).toBe('Title 1')
  expect(selectLinkedPages(data, 'de', 'nav')[0]?.title).toBe('Titel 1')
})

test('selectLinkedPages returns the frozen empty sentinel for a location nothing is linked to', () => {
  expect(selectLinkedPages([], 'en', 'nav')).toBe(EMPTY_TRANSLATED_PAGES)
  expect(selectLinkedPages(undefined, 'en', 'nav')).toBe(EMPTY_TRANSLATED_PAGES)
})

test('selectPageBySlug finds a page, undefined for an unknown or missing slug', () => {
  assert(selectPageBySlug(data, 'en', 'about'))
  expect(selectPageBySlug(data, 'en', 'about')?.id).toBe(2)
  expect(selectPageBySlug(data, 'en', 'nope')).toBeUndefined()
  expect(selectPageBySlug(data, 'en')).toBeUndefined() // no slug given
  expect(selectPageBySlug(undefined, 'en', 'home')).toBeUndefined()
})
