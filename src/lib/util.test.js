import { unwrapPara } from './util'

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
