import { applyMiddleware, combineReducers, createStore } from 'redux'
import { createReducer } from 'redux-orm'
import createSagaMiddleware from 'redux-saga'

import initialState from './initialState'
import orm from './orm'

// add redux devtools
const bindMiddleware = (middleware) => {
  let boundMiddleware = applyMiddleware(...middleware)
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    const { composeWithDevTools } = require('redux-devtools-extension')
    boundMiddleware = composeWithDevTools(boundMiddleware)
  }
  return boundMiddleware
}

const ormReducer = combineReducers({ orm: createReducer(orm) })

const defaultRootReducer = (innerReducer) => (state, action) => innerReducer(state, action)

// create store and run root saga
const makeMakeStore =
  (rootSaga, getRootReducer = defaultRootReducer) =>
  () => {
    const sagaMiddleware = createSagaMiddleware()
    const store = createStore(
      getRootReducer(ormReducer),
      initialState(),
      bindMiddleware([sagaMiddleware])
    )
    store.sagaTask = sagaMiddleware.run(rootSaga)
    return store
  }

export default makeMakeStore
