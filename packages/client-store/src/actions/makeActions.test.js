import makeActions from './makeActions'

describe('makeActions', () => {
  it('should create actions object', () => {
    expect(makeActions(['DO_THIS', 'DO_THAT'])).toEqual({
      DO_THIS: 'DO_THIS',
      DO_THAT: 'DO_THAT',
    })
  })

  it('should create empty actions object', () => {
    expect(makeActions()).toEqual({})
    expect(makeActions([])).toEqual({})
  })
})
