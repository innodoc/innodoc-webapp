import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import defaultInitialState from './defaultInitialState'
import rootReducer from './reducers'
import rootSaga from '../sagas'

const sagaMiddleware = createSagaMiddleware()

const bindMiddleware = (middleware) => {
  // add redux devtools
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    const { composeWithDevTools } = require('redux-devtools-extension')
    return composeWithDevTools(applyMiddleware(...middleware))
  }
  return applyMiddleware(...middleware)
}

export default function configureStore(initialState = defaultInitialState) {
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
