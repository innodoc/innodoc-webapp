import { astToString, formatNumberedTitleElt, formatSectionTitle } from '#utils/content'
import { getPageUrl, getSectionUrl, replacePathPrefixes } from '#utils/url'

// TODO fix/remove

test('astToString', () => {
  expect(astToString('foo')).toBe('foo')
  expect(
    astToString([
      { t: 'Str', c: 'Hello' },
      { t: 'Space', c: undefined },
      { t: 'Str', c: 'World' },
    ])
  ).toBe('Hello World')
})

test.skip('formatNumberedTitleElt', () => {
  // expect(formatNumberedTitleElt('Foo', [['data-number', '1.2.3']])).toBe('Foo 1.2.3')
  // expect(formatNumberedTitleElt('Foo', [['bar', 'baz']])).toBe('Foo')
})

test.skip('formatSectionTitle', () => {
  // expect(
  //   formatSectionTitle({
  //     id: 'test',
  //     childrenCount: 0,
  //     number: [0, 1],
  //     parents: [],
  //     shortTitle: 'Foo',
  //     title: 'Foobarbaz',
  //   })
  // ).toBe('1.2 Foobarbaz')
  // expect(
  //   formatSectionTitle(
  //     {
  //       id: 'test',
  //       childrenCount: 0,
  //       number: [0, 1],
  //       parents: [],
  //       shortTitle: 'Foo',
  //       title: 'Foobarbaz',
  //     },
  //     true
  //   )
  // ).toBe('1.2 Foo')
})

test('getSectionPath', () => {
  const sectionPath = getSectionPath({
    childrenCount: 0,
    id: 'foo',
    number: [0, 1],
    parents: ['bar', 'baz'],
    title: 'Foo',
  })
  expect(sectionPath).toBe('bar/baz/foo')
})

test('getPageUrl', () => {
  expect(getPageUrl('foo')).toBe('/page/foo')
})

test('getSectionUrl', () => {
  expect(getSectionUrl('bar/baz/foo')).toBe('/section/bar/baz/foo')
})

test('replacePathPrefixes', () => {
  expect(replacePathPrefixes('/page/foo')).toBe('/page/foo')
  expect(replacePathPrefixes('/section/baz/bar/foo')).toBe('/section/baz/bar/foo')
})
