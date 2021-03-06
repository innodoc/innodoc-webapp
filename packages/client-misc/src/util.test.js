import {
  astToString,
  attributesToObject,
  getClassNameToComponentMapper,
  getNumberedTitle,
  parseContentId,
  parseLink,
  intSortArray,
  makeSymbolObj,
  toTwoLetterCode,
  unwrapPara,
} from './util'

describe('astToString', () => {
  it('should just return a string', () => {
    expect(astToString('foo')).toBe('foo')
  })

  it('should convert AST to string', () => {
    const ast = [{ t: 'Str', c: 'Hello' }, { t: 'Space' }, { t: 'Str', c: 'World' }]
    expect(astToString(ast)).toBe('Hello World')
  })
})

describe('attributesToObject', () => {
  it('should convert null', () => {
    const input = null
    const output = attributesToObject(input)
    expect(output).toBeInstanceOf(Object)
    expect(Object.getOwnPropertyNames(output)).toHaveLength(0)
  })

  it('should convert empty array', () => {
    const input = []
    const output = attributesToObject(input)
    expect(output).toBeInstanceOf(Object)
    expect(Object.getOwnPropertyNames(output)).toHaveLength(0)
  })

  it('should convert array with 3 keys', () => {
    const input = [
      ['key1', 'val1'],
      ['key2', 'val2'],
      ['key3', 'val3'],
    ]
    const output = attributesToObject(input)
    expect(output).toBeInstanceOf(Object)
    expect(Object.getOwnPropertyNames(output)).toHaveLength(3)
    expect(output.key1).toBe('val1')
    expect(output.key2).toBe('val2')
    expect(output.key3).toBe('val3')
  })
})

describe('getClassNameToComponentMapper', () => {
  it('should create a working mapper function', () => {
    const Foo = () => 'Foo'
    const Bar = () => 'Bar'
    const mapper = getClassNameToComponentMapper({
      foo: Foo,
      bar: Bar,
    })
    expect(mapper('foo')).toBe(Foo)
    expect(mapper('bar')).toBe(Bar)
    expect(mapper('baz')).toBe(null)
  })
})

describe('getNumberedTitle', () => {
  it('should generate numbered title from title and attributes', () => {
    expect(getNumberedTitle('Foo', [['data-number', '1.2.3']])).toBe('Foo 1.2.3')
  })

  it('should just return title if "data-number" attribute is not present', () => {
    expect(getNumberedTitle('Foo', [['bar', 'baz']])).toBe('Foo')
  })
})

describe('parseContentId', () => {
  it('should parse a content ID with hash', () => {
    expect(parseContentId('foo/bar#baz')).toEqual(['foo/bar', 'baz'])
  })

  it('should parse a content ID without hash', () => {
    expect(parseContentId('foo/bar')).toEqual(['foo/bar'])
  })
})

describe('parseLink', () => {
  it.each(['page', 'section'])('should parse link (%s)', (contentType) => {
    const [parsedContentType, contentId] = parseLink(`/${contentType}/foo/bar`)
    expect(parsedContentType).toBe(contentType)
    expect(contentId).toBe('foo/bar')
  })

  it('should throw with malformed link', () => {
    expect(() => {
      parseLink('/foo/bar')
    }).toThrow()
  })
})

describe('intSortArray', () => {
  const sortFunc = intSortArray('de')

  it('should ignore case', () => {
    const unsorted = [{ name: 'alt' }, { name: 'Ast' }]
    expect(unsorted.sort(sortFunc)).toEqual([{ name: 'alt' }, { name: 'Ast' }])
  })

  it('should ignore special character $', () => {
    const unsorted = [{ name: 'pass' }, { name: '$n$' }, { name: '$\\LaTex$' }]
    expect(unsorted.sort(sortFunc)).toEqual([
      { name: '$\\LaTex$' },
      { name: '$n$' },
      { name: 'pass' },
    ])
  })

  it('should consider umlauts and accents', () => {
    const unsorted = [{ name: 'Zug' }, { name: 'Éclair' }, { name: 'Äpfel' }]
    expect(unsorted.sort(sortFunc)).toEqual([
      { name: 'Äpfel' },
      { name: 'Éclair' },
      { name: 'Zug' },
    ])
  })
})

describe('makeSymbolObj', () => {
  it('should create actions object', () => {
    expect(makeSymbolObj(['DO_THIS', 'DO_THAT'])).toEqual({
      DO_THIS: 'DO_THIS',
      DO_THAT: 'DO_THAT',
    })
  })

  it('should create empty actions object', () => {
    expect(makeSymbolObj()).toEqual({})
    expect(makeSymbolObj([])).toEqual({})
  })
})

describe('toTwoLetterCode', () => {
  it('should normalize language codes', () => {
    expect(toTwoLetterCode('en-US')).toEqual('en')
    expect(toTwoLetterCode('de')).toEqual('de')
  })
})

describe('unwrapPara', () => {
  it('should unwrap single Para', () => {
    const unwrapped = unwrapPara([{ t: 'Para', c: ['foo'] }])
    expect(unwrapped).toEqual(['foo'])
  })

  it('should not unwrap single Plain', () => {
    const unwrapped = unwrapPara([{ t: 'Plain', c: ['foo'] }])
    expect(unwrapped).toEqual([{ t: 'Plain', c: ['foo'] }])
  })

  it('should unwrap list of items', () => {
    const items = [
      { t: 'Para', c: ['foo'] },
      { t: 'Div', c: ['bar'] },
      { t: 'Para', c: ['baz'] },
    ]
    const unwrapped = unwrapPara(items)
    expect(unwrapped).toEqual([['foo'], { t: 'Div', c: ['bar'] }, ['baz']])
  })

  it('should return empty list for empty list', () => expect(unwrapPara([])).toEqual([]))
})
