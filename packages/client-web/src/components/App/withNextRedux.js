import { createWrapper, HYDRATE } from 'next-redux-wrapper'

import rootSaga from '@innodoc/client-sagas'
import makeMakeStore from '@innodoc/client-store/src/store'

// next-redux-wrapper needs HYDRATE action to be handled
const getRootReducer = (innerReducer) => (state, action) =>
  action.type === HYDRATE
    ? { ...state, ...action.payload }
    : innerReducer(state, action)

const makeStore = makeMakeStore(rootSaga, getRootReducer)
const nextReduxWrapper = createWrapper(makeStore)

export { getRootReducer } // for testing
export default nextReduxWrapper.withRedux
