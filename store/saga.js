import {put, takeLatest} from 'redux-saga/effects'
import es6promise from 'es6-promise'
import 'isomorphic-unfetch'

import {
  actionTypes,
  failure,
  loadTocSuccess,
  loadPageSuccess,
} from './actions/content'

es6promise.polyfill()

const baseContent = process.env.CONTENT_ROOT

function * loadTocSaga() {
  // const loc = `${baseContent}/de/toc.json`
  try {
    const res = yield fetch(baseContent)
    const data = yield res.json()
    yield put(loadTocSuccess(data))
  } catch (err) {
    yield put(failure(err))
  }
}

function * loadPageSaga(section) {
  const loc = `${baseContent}/de/VBKM01/M01_Bruchrechnung/mit-bruchen-rechnen/content.json`
  // const loc = process.browser
  //   ? `/static/${action.pageSlug}.json`
  //   : `http://localhost:3000/static/${action.pageSlug}.json`
  try {
    const res = yield fetch(loc)
    const data = yield res.json()
    yield put(loadPageSuccess(data.content))
  } catch (err) {
    yield put(failure(err))
  }
}

function * rootSaga() {
  yield takeLatest(actionTypes.LOAD_TOC, loadTocSaga)
  yield takeLatest(actionTypes.LOAD_PAGE, loadPageSaga)
}

export default rootSaga
