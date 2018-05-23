import es6promise from 'es6-promise'
import { all, fork } from 'redux-saga/effects'

import { watchLoadToc, watchLoadSection } from './content'

es6promise.polyfill() // for IE

export default function* root() {
  yield all([
    fork(watchLoadToc),
    fork(watchLoadSection),
  ])
}
