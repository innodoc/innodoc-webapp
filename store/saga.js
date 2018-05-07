import {put, takeLatest} from 'redux-saga/effects'
import es6promise from 'es6-promise'
import 'isomorphic-unfetch'

import {actionTypes, failure, loadPageSuccess} from './actions'

es6promise.polyfill()

function * loadPageSaga(action) {
  const loc = `http://localhost:3000/static/${action.pageSlug}.json`
  try {
    const res = yield fetch(loc)
    const data = yield res.json()
    yield put(loadPageSuccess(data))
  } catch (err) {
    yield put(failure(err))
  }
}

function * rootSaga() {
  yield takeLatest(actionTypes.LOAD_PAGE, loadPageSaga)
}

export default rootSaga
