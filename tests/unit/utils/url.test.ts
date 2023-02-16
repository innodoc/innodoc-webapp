import {
  extractLocale,
  formatUrl,
  getPageUrl,
  getSectionUrl,
  getUrl,
  replacePathPrefixes,
} from '#utils/url'

test('extractLocale', () => {
  expect(extractLocale('/de/foo/bar', 'fr')).toEqual({
    locale: 'de',
    urlWithoutLocale: '/foo/bar',
  })
  expect(extractLocale('/foo/bar', 'fr')).toEqual({
    locale: 'fr',
    urlWithoutLocale: '/foo/bar',
  })
  expect(extractLocale('/foo/bar')).toEqual({
    locale: 'en',
    urlWithoutLocale: '/foo/bar',
  })
  expect(extractLocale('/de/foo/bar', 'en')).toEqual({
    locale: 'de',
    urlWithoutLocale: '/foo/bar',
  })
  expect(extractLocale('/fr/foo/bar')).toEqual({
    locale: 'fr',
    urlWithoutLocale: '/foo/bar',
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

test('getUrl', () => {
  expect(getUrl('api/course', { courseId: 12 })).toBe('/api/course/12')
  expect(getUrl('api/course/section/content', { courseId: 12, locale: 'de', sectionId: 123 })).toBe(
    '/api/course/12/section/de/123'
  )
  expect(() => {
    getUrl('api/course/section/content', { courseId: 12, locale: 'de', sectionId: 'abc' })
  }).toThrow('Expected "sectionId" to match')
})

test('getPageUrl', () => {
  expect(getPageUrl('foo')).toBe('/pagetest/foo')
})

test('getSectionUrl', () => {
  expect(getSectionUrl('foo/bar/baz')).toBe('/sectiontest/foo/bar/baz')
})

test('replacePathPrefixes', () => {
  expect(replacePathPrefixes('/page/foo')).toBe('/pagetest/foo')
  expect(replacePathPrefixes('/section/foo/bar')).toBe('/sectiontest/foo/bar')
})
