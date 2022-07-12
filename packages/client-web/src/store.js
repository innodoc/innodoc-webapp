// TODO: move to ./lib ??

// import { fork, take } from 'redux-saga/effects'
// import { createWrapper, HYDRATE } from 'next-redux-wrapper'
import { createWrapper } from 'next-redux-wrapper'

import clientSagas from '@innodoc/client-sagas'
import makeMakeStore from '@innodoc/client-store/src/store'

// next-redux-wrapper needs HYDRATE to be handled
// const getRootReducer = (innerReducer) => (state, action) => {
//   if (action.type === HYDRATE) {
//     console.log('handling HYDRATE action')
//   }
//   return action.type === HYDRATE ? { ...state, ...action.payload } : innerReducer(state, action)
// }

// // Start after HYDRATE
// function* rootSaga() {
//   console.log('Starting root saga')
//   if (typeof window !== 'undefined') {
//     yield take(HYDRATE)
//   }
//   yield fork(clientSagas)
// }

// const makeStore = makeMakeStore(rootSaga, getRootReducer)
const makeStore = makeMakeStore(clientSagas)

// export { getRootReducer } // for testing
export default createWrapper(makeStore)
