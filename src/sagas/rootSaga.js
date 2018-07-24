import es6promise from 'es6-promise'
import { all, fork } from 'redux-saga/effects'

import watchI18n from './i18n'
import { watchLoadToc, watchLoadSection } from './content'
import watchExerciseChange from './exercise'

es6promise.polyfill() // for IE

export default function* root() {
  yield all([
    // i18n
    fork(watchI18n),
    // fork(watchChangeLanguage),
    // content
    fork(watchLoadToc),
    fork(watchLoadSection),
    // exercise
    fork(watchExerciseChange),
  ])
}
