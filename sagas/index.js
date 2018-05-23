import es6promise from 'es6-promise'
import { all, fork } from 'redux-saga/effects'

import { loadTocWatcher, loadSectionWatcher } from './content'

es6promise.polyfill() // for IE

function* rootSaga() {
  yield all([
    fork(loadTocWatcher),
    fork(loadSectionWatcher),
  ])
}

export default rootSaga
