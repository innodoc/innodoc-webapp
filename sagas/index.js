import es6promise from 'es6-promise'
import { all, fork } from 'redux-saga/effects'
import 'isomorphic-unfetch' // TODO: refactor to lib/api.js

import { watchLoadToc, watchLoadSection } from './content'
import watchExerciseChange from './exercise'

es6promise.polyfill() // for IE

export default function* root() {
  yield all([
    fork(watchLoadToc),
    fork(watchLoadSection),
    fork(watchExerciseChange),
  ])
}
