import { applyMiddleware, combineReducers, createStore } from 'redux'
import { createReducer } from 'redux-orm'
import createSagaMiddleware from 'redux-saga'

import initialState from './initialState.js'
import orm from './orm.js'

// add redux devtools
const bindMiddleware = (middleware) => {
  let boundMiddleware = applyMiddleware(...middleware)
  // if (process.env.NODE_ENV !== 'production') {
  // const { composeWithDevTools } = require('redux-devtools-extension')
  // boundMiddleware = composeWithDevTools(boundMiddleware)
  // }
  return boundMiddleware
}

const ormReducer = combineReducers({ orm: createReducer(orm) })

// const defaultRootReducer = (innerReducer) => (state, action) => innerReducer(state, action)

// create store and run root saga
const getMakeStore =
  // (rootSaga, getRootReducer = defaultRootReducer) =>
  (rootSaga) => () => {
    // TODO: Weird import error, doing work-around for now
    // https://github.com/redux-saga/redux-saga/issues/1346
    // const sagaMiddleware = createSagaMiddleware()
    const sagaMiddleware =
      typeof createSagaMiddleware === 'function'
        ? createSagaMiddleware()
        : createSagaMiddleware.default()

    const store = createStore(
      ormReducer,
      // getRootReducer(ormReducer),
      initialState(),
      bindMiddleware([sagaMiddleware])
    )
    store.sagaTask = sagaMiddleware.run(rootSaga)
    return store
  }

export default getMakeStore
