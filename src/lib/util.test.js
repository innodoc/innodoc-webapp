import { getClassNameToComponentMapper, unwrapPara } from './util'

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
