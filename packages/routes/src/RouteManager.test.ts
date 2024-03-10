import RouteManager from './RouteManager'

let routeManager: RouteManager

beforeEach(() => {
  routeManager = RouteManager.getInstance('URL', 'page', 'section')
})

test('parseLinkSpecifier parses course page route', () => {
  expect(routeManager.parseLinkSpecifier('app:course:page|foo-bar')).toStrictEqual({
    name: 'app:course:page',
    pageSlug: 'foo-bar',
  })
})

test('parseLinkSpecifier parses course section route', () => {
  expect(routeManager.parseLinkSpecifier('app:course:section|foo/bar/baz')).toStrictEqual({
    name: 'app:course:section',
    sectionPath: 'foo/bar/baz',
  })
})

test('parseLinkSpecifier parses route w/o argument', () => {
  expect(routeManager.parseLinkSpecifier('app:index')).toStrictEqual({ name: 'app:index' })
})

test('parseLinkSpecifier throws with unknown route name', () => {
  expect(() => routeManager.parseLinkSpecifier('app:course:secti0n|foo/bar/baz')).toThrowError(TypeError)
})

test('parseLinkSpecifier throws with missing arg', () => {
  expect(() => routeManager.parseLinkSpecifier('app:course:section|')).toThrowError(TypeError)
  expect(() => routeManager.parseLinkSpecifier('app:course:section')).toThrowError(TypeError)
})
