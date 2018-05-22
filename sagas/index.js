import es6promise from 'es6-promise'
import { all, takeLatest } from 'redux-saga/effects'

import { actionTypes } from '../store/actions/content'
import { loadTocSaga, loadSectionSaga } from './content'

es6promise.polyfill() // for IE

function* rootSaga() {
  yield all([
    takeLatest(actionTypes.LOAD_TOC, loadTocSaga),
    takeLatest(actionTypes.LOAD_SECTION, loadSectionSaga),
  ])
}

export default rootSaga
