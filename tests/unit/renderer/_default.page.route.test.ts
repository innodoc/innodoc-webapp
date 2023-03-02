import { DEFAULT_ROUTE_NAME } from '#constants'
import { onBeforeRoute } from '#renderer/_default.page.route'
import type { PageContextOnBeforeRoute } from '#types/pageContext'

const getPageContext = (
  context: Partial<PageContextOnBeforeRoute> = {}
): PageContextOnBeforeRoute => ({
  host: 'www.example.com',
  requestLocale: 'fr',
  urlOriginal: '/de/foo/bar',
  ...context,
})

test('onBeforeRoute', () => {
  const pageContextInput = getPageContext()
  const { pageContext } = onBeforeRoute(pageContextInput)

  expect(pageContext.routeInfo?.courseSlug).toBe('test')
  expect(pageContext.routeInfo?.locale).toBe('de')
  expect(pageContext.routeInfo?.routeName).toBe(DEFAULT_ROUTE_NAME)
  expect(pageContext.needRedirect).toBe(false)
})

test('onBeforeRoute (no locale in URL)', () => {
  const pageContextInput = getPageContext({ urlOriginal: '/foo/bar' })
  const { pageContext } = onBeforeRoute(pageContextInput)

  expect(pageContext.routeInfo?.locale).toBe('fr')
  expect(pageContext.needRedirect).toBe(true)
})

test('onBeforeRoute (INNODOC_COURSE_SLUG_MODE=SUBDOMAIN)', () => {
  vi.stubEnv('INNODOC_COURSE_SLUG_MODE', 'SUBDOMAIN')

  const pageContextInput = getPageContext({ host: 'foobar.example.com' })
  const { pageContext } = onBeforeRoute(pageContextInput)

  expect(pageContext.routeInfo?.courseSlug).toBe('foobar')
  expect(pageContext.needRedirect).toBe(false)
})

test('onBeforeRoute (INNODOC_COURSE_SLUG_MODE=SUBDOMAIN fail)', () => {
  vi.stubEnv('INNODOC_COURSE_SLUG_MODE', 'SUBDOMAIN')

  const pageContextInput = getPageContext({ host: 'example.com' })
  const { pageContext } = onBeforeRoute(pageContextInput)

  expect(pageContext.routeInfo?.courseSlug).toBe('test')
  expect(pageContext.needRedirect).toBe(true)
})

test('onBeforeRoute (INNODOC_COURSE_SLUG_MODE=URL)', () => {
  vi.stubEnv('INNODOC_COURSE_SLUG_MODE', 'URL')

  const pageContextInput = getPageContext({ urlOriginal: '/de/course-test/pagetest/foo-bar' })
  const { pageContext } = onBeforeRoute(pageContextInput)

  expect(pageContext.routeInfo?.courseSlug).toBe('course-test')
  expect(pageContext.routeInfo?.locale).toBe('de')
  expect(pageContext.needRedirect).toBe(false)
})

test('onBeforeRoute (INNODOC_COURSE_SLUG_MODE=URL fail)', () => {
  vi.stubEnv('INNODOC_COURSE_SLUG_MODE', 'URL')

  const pageContextInput = getPageContext({ urlOriginal: '/es' })
  const { pageContext } = onBeforeRoute(pageContextInput)

  expect(pageContext.routeInfo?.courseSlug).toBe('test')
  expect(pageContext.routeInfo?.locale).toBe('es')
  expect(pageContext.needRedirect).toBe(true)
})
