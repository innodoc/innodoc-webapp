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

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      // eslint-disable-next-line global-require
      const nextReducer = require('./reducers').default
      store.replaceReducer(nextReducer)
    })
    module.hot.accept('../sagas', () => {
      // eslint-disable-next-line global-require
      const nextSagas = require('../sagas').default
      store.sagaTask.cancel()
      store.sagaTask.done.then(() => {
        store.runSagas(nextSagas)
      })
    })
  }

  store.runSagaTask = () => {
    store.sagaTask = sagaMiddleware.run(rootSaga)
  }

  store.runSagaTask()
  return store
}
