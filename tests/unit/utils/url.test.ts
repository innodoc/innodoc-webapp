import type { CourseSlugMode } from '#types/common'
import { extractLocale, replacePathPrefixes } from '#utils/url'

async function importGetUrl(courseSlugMode: CourseSlugMode = 'DISABLE') {
  vi.resetModules()
  vi.stubEnv('INNODOC_COURSE_SLUG_MODE', courseSlugMode)
  return (await import('#utils/url')).getUrl
}

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

test('replacePathPrefixes', () => {
  expect(replacePathPrefixes('/page/foo')).toBe('/pagetest/foo')
  expect(replacePathPrefixes('/section/foo/bar')).toBe('/sectiontest/foo/bar')
})

test('getUrl', async () => {
  const getUrl = await importGetUrl()

  // App
  expect(getUrl('app:page', { locale: 'en', pageSlug: 'f' })).toBe('/en/pagetest/f')
  expect(getUrl('app:page', { locale: 'en', pageSlug: 'foo' })).toBe('/en/pagetest/foo')
  expect(getUrl('app:page', { locale: 'en', pageSlug: 'foo-bar' })).toBe('/en/pagetest/foo-bar')
  expect(getUrl('app:section', { locale: 'en', sectionPath: 'f' })).toBe('/en/sectiontest/f')
  expect(getUrl('app:section', { locale: 'en', sectionPath: 'foo-bar' })).toBe(
    '/en/sectiontest/foo-bar'
  )
  expect(getUrl('app:section', { locale: 'en', sectionPath: 'foo-bar/baz' })).toBe(
    '/en/sectiontest/foo-bar/baz'
  )

  // App fails
  expect(() => getUrl('app:section', { locale: 'English', sectionPath: 'foo' })).toThrow(
    'Expected "locale" to match'
  )
  expect(() => getUrl('app:page', { locale: 'en', pageSlug: 'fooBar' })).toThrow(
    'Expected "pageSlug" to match'
  )
  expect(() => getUrl('app:page', { locale: 'en', pageSlug: 'foo_bar' })).toThrow(
    'Expected "pageSlug" to match'
  )
  expect(() => getUrl('app:section', { locale: 'en', sectionPath: 'foo/bar/baz_5' })).toThrow(
    'Expected "sectionPath" to match'
  )

  // API
  expect(getUrl('api:course', { courseId: 12 })).toBe('/api/course/12')
  expect(getUrl('api:course:pages', { courseId: 12 })).toBe('/api/course/12/pages')
  expect(getUrl('api:course:section:content', { courseId: 12, locale: 'de', sectionId: 123 })).toBe(
    '/api/course/12/section/de/123'
  )
  expect(
    getUrl('api:course:fragment:content', { courseId: 12, locale: 'en', fragmentType: 'footer-a' })
  ).toBe('/api/course/12/fragment/en/footer-a')

  // API fails
  expect(() => {
    getUrl('api:course', { courseId: 'foo' })
  }).toThrow('Expected "courseId" to match')
  expect(() => {
    getUrl('api:course:page:content', { courseId: 12, locale: 'foobar', sectionId: 12 })
  }).toThrow('Expected "locale" to match')
  expect(() => {
    getUrl('api:course:section:content', { courseId: 12, locale: 'de', sectionId: 'abc' })
  }).toThrow('Expected "sectionId" to match')
  expect(() => {
    getUrl('api:course:fragment:content', {
      courseId: 12,
      locale: 'en',
      fragmentType: 'non-existent',
    })
  }).toThrow('Expected "fragmentType" to match')
})

test('getUrl (INNODOC_COURSE_SLUG_MODE=URL)', async () => {
  const getUrl = await importGetUrl('URL')

  expect(getUrl('app:page', { courseSlug: 'testcourse', locale: 'en', pageSlug: 'foo-bar' })).toBe(
    '/testcourse/en/pagetest/foo-bar'
  )
  expect(() => {
    getUrl('app:page', { courseSlug: 'Foobar', locale: 'en', pageSlug: 'foo-bar' })
  }).toThrow('Expected "courseSlug" to match')
})