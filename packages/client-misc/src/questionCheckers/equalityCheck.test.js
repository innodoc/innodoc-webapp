import equalitCheck from './equalityCheck'

describe('equalityCheck', () => {
  it('checks two strings', () => {
    expect(equalitCheck('foo', 'foo')).toBe(true)
    expect(equalitCheck('bar', 'bar')).toBe(true)
    expect(equalitCheck('foo', 'bar')).toBe(false)
  })

  it('checks two booleans', () => {
    expect(equalitCheck(true, true)).toBe(true)
    expect(equalitCheck(false, false)).toBe(true)
    expect(equalitCheck(true, false)).toBe(false)
  })
})
