import { fork, take } from 'redux-saga/effects'
import { createWrapper, HYDRATE } from 'next-redux-wrapper'

import clientSagas from '@innodoc/client-sagas'
import makeMakeStore from '@innodoc/client-store/src/store'

// next-redux-wrapper needs HYDRATE to be handled
const getRootReducer = (innerReducer) => (state, action) =>
  action.type === HYDRATE ? { ...state, ...action.payload } : innerReducer(state, action)

// Start after HYDRATE
function* rootSaga() {
  if (typeof window !== 'undefined') {
    yield take(HYDRATE)
  }
  yield fork(clientSagas)
}

const makeStore = makeMakeStore(rootSaga, getRootReducer)
const nextReduxWrapper = createWrapper(makeStore)

export { getRootReducer } // for testing
export default nextReduxWrapper.withRedux
