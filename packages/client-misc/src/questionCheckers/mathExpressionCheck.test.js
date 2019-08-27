import mathExpressionCheck from './mathExpressionCheck'

describe('equalityCheck', () => {
  it.each(
    ['1/4*pi*x*x', 'x^2/4*pi', '0.5^2*pi*x*x', '0.5^2*pi*x^2']
  )('should confirm term equality "1/4*pi*x^2" and "%s"', (term) => {
    expect(mathExpressionCheck('1/4*pi*x^2', term)).toBe(true)
  })

  it('should detect inequality', () => {
    expect(mathExpressionCheck('1/4*pi*x^2', '1/2*pi*x^2')).toBe(false)
  })
})
