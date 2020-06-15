import initialState from './initialState'
import orm from './orm'

describe('initialState', () => {
  it('should return initial state', () => {
    const state = initialState()
    expect(state).toHaveProperty('orm')
    expect(state.orm).toHaveProperty('App')
    expect(state.orm).toHaveProperty('Course')
    expect(state.orm).toHaveProperty('Fragment')
    expect(state.orm).toHaveProperty('IndexTerm')
    expect(state.orm).toHaveProperty('IndexTermLocation')
    expect(state.orm).toHaveProperty('Page')
    expect(state.orm).toHaveProperty('Question')
    expect(state.orm).toHaveProperty('Section')
    expect(orm.session(state.orm).App.first()).toBeDefined()
  })
})
