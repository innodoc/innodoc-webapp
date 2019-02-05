import { combineReducers, createStore, applyMiddleware } from 'redux'
import { createReducer } from 'redux-orm'
import createSagaMiddleware from 'redux-saga'

import orm from './orm'
import defaultInitialState from './defaultInitialState'
import rootSaga from '../sagas'

const sagaMiddleware = createSagaMiddleware()

const bindMiddleware = (middleware) => {
  let boundMiddleware = applyMiddleware(...middleware)
  // add redux devtools
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    const { composeWithDevTools } = require('redux-devtools-extension')
    boundMiddleware = composeWithDevTools(boundMiddleware)
  }
  return boundMiddleware
}

export default function configureStore(initialState = defaultInitialState()) {
  const rootReducer = combineReducers({ orm: createReducer(orm) })

  const store = createStore(
    rootReducer,
    initialState,
    bindMiddleware([sagaMiddleware])
  )

  store.runSagaTask = () => {
    store.sagaTask = sagaMiddleware.run(rootSaga)
  }

  store.runSagaTask()
  return store
}
