import { extractLocale, formatUrl } from '@/utils/url'

test('extractLocale', () => {
  expect(extractLocale('/de/foo/bar', ['de', 'en'], 'en')).toEqual({
    locale: 'de',
    urlWithoutLocale: '/foo/bar',
  })
  expect(extractLocale('/fr/foo/bar', ['de', 'en'], 'en')).toEqual({
    locale: 'en',
    urlWithoutLocale: '/fr/foo/bar',
  })
  expect(extractLocale('/fr/foo/bar', ['de', 'en'])).toEqual({
    locale: 'de',
    urlWithoutLocale: '/fr/foo/bar',
  })
})

test('formatUrl', () => {
  expect(formatUrl('/section/foo', 'en')).toBe('/en/section/foo')
  expect(formatUrl('/section/foo', 'en', 'bar')).toBe('/en/section/foo#bar')
  expect(formatUrl('/section/foo', 'en', undefined, 'http://example.com/')).toBe(
    'http://example.com/en/section/foo'
  )
  expect(formatUrl('/section/foo', 'en', 'baz', 'http://example.com/')).toBe(
    'http://example.com/en/section/foo#baz'
  )
})
