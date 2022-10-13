import {
  attributesToObject,
  formatNumberedTitleElt,
  formatSectionTitle,
  getClassNameToComponentMapper,
  getPageUrl,
  getSectionPath,
  getSectionUrl,
  replacePathPrefixes,
} from '@/utils/content'

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

describe('formatNumberedTitleElt', () => {
  test('generate numbered title from title and attributes', () => {
    expect(formatNumberedTitleElt('Foo', [['data-number', '1.2.3']])).toBe('Foo 1.2.3')
  })

  test('return title if "data-number" attribute is not present', () => {
    expect(formatNumberedTitleElt('Foo', [['bar', 'baz']])).toBe('Foo')
  })
})

describe('formatSectionTitle', () => {
  test('formatSectionTitle', () => {
    const title = formatSectionTitle({
      id: 'test',
      childrenCount: 0,
      number: [0, 1],
      parents: [],
      shortTitle: 'Foo',
      title: 'Foobarbaz',
    })
    expect(title).toBe('1.2 Foobarbaz')
  })

  test('formatSectionTitle (short)', () => {
    const shortTitle = formatSectionTitle(
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
    expect(shortTitle).toBe('1.2 Foo')
  })
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
  expect(mapper(['baz', 'quz'])).toBe(null)
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

test('getPageUrl', () => {
  expect(getSectionUrl('bar/baz/foo')).toBe('/section/bar/baz/foo')
})

test('replacePathPrefixes', () => {
  expect(replacePathPrefixes('/page/foo')).toBe('/page/foo')
  expect(replacePathPrefixes('/section/baz/bar/foo')).toBe('/section/baz/bar/foo')
})
