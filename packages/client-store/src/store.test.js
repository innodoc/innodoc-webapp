import { Session } from 'redux-orm'

import orm from './orm'
import makeMakeStore from './store'

const makeStore = makeMakeStore(function* dummyRootSaga() {
  yield
})

describe('makeStore', () => {
  it('should create a store', () => {
    const store = makeStore()
    expect(store).toBeDefined()
    const state = store.getState()
    expect(state.orm.App).toBeDefined()
    expect(state.orm.Course).toBeDefined()
    expect(state.orm.Fragment).toBeDefined()
    expect(state.orm.IndexTerm).toBeDefined()
    expect(state.orm.IndexTermLocation).toBeDefined()
    expect(state.orm.Page).toBeDefined()
    expect(state.orm.Question).toBeDefined()
    expect(state.orm.Section).toBeDefined()
    expect(orm.session(store.getState())).toBeInstanceOf(Session)
  })
})
