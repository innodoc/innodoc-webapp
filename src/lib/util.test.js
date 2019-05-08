import {
  astToString,
  attributesToObject,
  getClassNameToComponentMapper,
  getDisplayName,
  getHocDisplayName,
  parseSectionId,
  toTwoLetterCode,
  unwrapPara,
} from './util'

describe('astToString', () => {
  it('should just return a string', () => {
    expect(astToString('foo')).toBe('foo')
  })

  it('should convert AST to string', () => {
    const ast = [
      { t: 'Str', c: 'Hello' },
      { t: 'Space' },
      { t: 'Str', c: 'World' },
    ]
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

describe('getDisplayName', () => {
  it("should return Component's displayName", () => {
    const Component = () => 'Hello Little!'
    Component.displayName = 'MyLittleComponent'
    expect(getDisplayName(Component)).toBe('MyLittleComponent')
  })

  it('should return "Component" if there\'s no displayName', () => {
    const Component = () => 'Hello'
    expect(getDisplayName(Component)).toBe('Component')
  })
})

describe('getHocDisplayName', () => {
  it('should return HOC display name', () => {
    const Component = () => 'Hello'
    Component.displayName = 'HelloComponent'
    const displayName = getHocDisplayName('HOComponent', Component)
    expect(displayName).toBe('HOComponent(HelloComponent)')
  })
})

describe('parseSectionId', () => {
  it('should parse a section ID with hash', () => {
    expect(parseSectionId('foo/bar#baz')).toEqual(['foo/bar', 'baz'])
  })

  it('should parse a section ID without hash', () => {
    expect(parseSectionId('foo/bar')).toEqual(['foo/bar'])
  })
})

describe('toTwoLetterCode', () => {
  it('should normalize language codes', () => {
    expect(toTwoLetterCode('en-US')).toEqual('en')
    expect(toTwoLetterCode('de')).toEqual('de')
  })
})

describe('unwrapPara', () => {
  it('should unwrap', () => {
    const unwrapped = unwrapPara([{ t: 'Para', c: ['foo'] }])
    expect(unwrapped).toEqual(['foo'])
  })

  it('should not unwrap without Para', () => {
    const unwrapped = unwrapPara([{ t: 'Plain', c: ['foo'] }])
    expect(unwrapped).toEqual([{ t: 'Plain', c: ['foo'] }])
  })
})
