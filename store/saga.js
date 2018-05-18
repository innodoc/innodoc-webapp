import { put, takeLatest } from 'redux-saga/effects'
import es6promise from 'es6-promise'
import 'isomorphic-unfetch'

import {
  actionTypes,
  loadTocSuccess,
  loadTocFailure,
  loadPageSuccess,
  loadPageFailure,
} from './actions/content'

es6promise.polyfill() // TODO: make sure we really need this

const contentRoot = process.env.CONTENT_ROOT

function* loadTocSaga() {
  // TODO make this work
  const loc = `${contentRoot}/de/toc.json`
  try {
    const res = yield fetch(loc)
    const data = yield res.json()
    yield put(loadTocSuccess(data))
  } catch (err) {
    yield put(loadTocFailure(err))
  }
}

function* loadPageSaga({ section }) {
  // TODO make this work
  const loc = `${contentRoot}/de/${section}/content.json`
  try {
    const res = yield fetch(loc)
    const data = yield res.json()
    yield put(loadPageSuccess(data.content))
  } catch (err) {
    yield put(loadPageFailure(err))
  }
}

function* rootSaga() {
  yield takeLatest(actionTypes.LOAD_TOC, loadTocSaga)
  yield takeLatest(actionTypes.LOAD_PAGE, loadPageSaga)
}

export default rootSaga
