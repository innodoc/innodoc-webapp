import type { Block, Inline } from 'pandoc-filter'

import {
  astToString,
  attributesToObject,
  formatNumberedTitleElt,
  formatSectionTitle,
  getClassNameToComponentMapper,
  getPageUrl,
  getSectionPath,
  getSectionUrl,
  replacePathPrefixes,
  unwrapPara,
} from '@/utils/content'

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

describe('attributesToObject', () => {
  test('convert null', () => {
    const output = attributesToObject(null)
    expect(output).toBeInstanceOf(Object)
    expect(Object.getOwnPropertyNames(output)).toHaveLength(0)
  })

  test('convert empty array', () => {
    const output = attributesToObject([])
    expect(output).toBeInstanceOf(Object)
    expect(Object.getOwnPropertyNames(output)).toHaveLength(0)
  })

  test('convert array with 3 keys', () => {
    const output = attributesToObject([
      ['key1', 'val1'],
      ['key2', 'val2'],
      ['key3', 'val3'],
    ])
    expect(output).toBeInstanceOf(Object)
    expect(Object.getOwnPropertyNames(output)).toHaveLength(3)
    expect(output.key1).toBe('val1')
    expect(output.key2).toBe('val2')
    expect(output.key3).toBe('val3')
  })
})

test('formatNumberedTitleElt', () => {
  expect(formatNumberedTitleElt('Foo', [['data-number', '1.2.3']])).toBe('Foo 1.2.3')
  expect(formatNumberedTitleElt('Foo', [['bar', 'baz']])).toBe('Foo')
})

test('formatSectionTitle', () => {
  expect(
    formatSectionTitle({
      id: 'test',
      childrenCount: 0,
      number: [0, 1],
      parents: [],
      shortTitle: 'Foo',
      title: 'Foobarbaz',
    })
  ).toBe('1.2 Foobarbaz')
  expect(
    formatSectionTitle(
      {
        id: 'test',
        childrenCount: 0,
        number: [0, 1],
        parents: [],
        shortTitle: 'Foo',
        title: 'Foobarbaz',
      },
      true
    )
  ).toBe('1.2 Foo')
})

test('getClassNameToComponentMapper', () => {
  const Foo = () => <>Foo</>
  const Bar = () => <>Bar</>
  const mapper = getClassNameToComponentMapper({
    foo: Foo,
    bar: Bar,
  })
  expect(mapper(['qux', 'foo'])).toBe(Foo)
  expect(mapper(['bar'])).toBe(Bar)
  expect(mapper(['baz', 'quz'])).toBeUndefined()
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

test('unwrapPara', () => {
  const inlineEl: Inline = { t: 'Str', c: 'foo' }
  const blockEl: Block = { t: 'Plain', c: [inlineEl] }

  expect(unwrapPara([{ t: 'Para', c: [inlineEl] }])).toEqual([inlineEl])
  expect(unwrapPara([{ t: 'Plain', c: [inlineEl] }])).toEqual([{ t: 'Plain', c: [inlineEl] }])
  expect(
    unwrapPara([
      { t: 'Para', c: [inlineEl] },
      { t: 'Div', c: [['', [], []], [blockEl]] },
      { t: 'Para', c: [inlineEl] },
    ])
  ).toEqual([[inlineEl], { t: 'Div', c: [['', [], []], [blockEl]] }, [inlineEl]])
  expect(unwrapPara([])).toEqual([])
})
