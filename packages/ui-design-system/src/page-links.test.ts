import { expect, test } from 'vitest'
import { selectPageLinks } from './page-links.js'

test('selectPageLinks returns only the index link for a non-course route', () => {
  expect(selectPageLinks('nav', false).map((page) => page.routeName)).toStrictEqual(['app:index'])
})

test('selectPageLinks returns course links and no index link for a course route', () => {
  expect(selectPageLinks('nav', true).map((page) => page.routeName)).toStrictEqual(['app:course:progress'])
  expect(selectPageLinks('footer', true).map((page) => page.routeName)).toStrictEqual([
    'app:course:progress',
    'app:course:toc',
    'app:course:glossary',
  ])
})

test('selectPageLinks only returns links bound to the requested slot', () => {
  expect(selectPageLinks('footer', false).map((page) => page.routeName)).toStrictEqual(['app:index'])
})
