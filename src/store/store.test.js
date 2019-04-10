import { Session } from 'redux-orm'
import orm from './orm'
import makeStore from './store'
import defaultInitialState from './defaultInitialState'

describe('makeStore', () => {
  it('should create a store', () => {
    const store = makeStore()
    expect(store).toBeDefined()
    const state = store.getState()
    expect(state.orm.App).toBeDefined()
    expect(state.orm.Course).toBeDefined()
    expect(state.orm.Section).toBeDefined()
    expect(orm.session(store.getState())).toBeInstanceOf(Session)
  })
})

describe('defaultInitialState', () => {
  it('should return a proper initial state', () => {
    const state = defaultInitialState()
    expect(state).toHaveProperty('orm')
    expect(state.orm).toHaveProperty('App')
    expect(state.orm).toHaveProperty('Course')
    expect(state.orm).toHaveProperty('Section')
    expect(orm.session(state.orm).App.first()).toBeDefined()
  })
})
