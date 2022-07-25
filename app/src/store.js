// TODO: move to ./lib ??

// import { fork, take } from 'redux-saga/effects'
// import { createWrapper, HYDRATE } from 'next-redux-wrapper'
import { createWrapper } from 'next-redux-wrapper'

import clientSagas from '@innodoc/sagas'
import getMakeStore from '@innodoc/store/getMakeStore'

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

// const makeStore = getMakeStore(rootSaga, getRootReducer)
const makeStore = getMakeStore(clientSagas)

// export { getRootReducer } // for testing
export default createWrapper(makeStore)
