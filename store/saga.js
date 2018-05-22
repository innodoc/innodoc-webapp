import es6promise from 'es6-promise'
import { all, put, takeLatest } from 'redux-saga/effects'
import 'isomorphic-unfetch'

import {
  actionTypes,
  loadTocSuccess,
  loadTocFailure,
  loadSectionSuccess,
  loadSectionFailure,
} from './actions/content'

es6promise.polyfill() // for IE

const contentRoot = process.env.CONTENT_ROOT

function* loadTocSaga() {
  const loc = `${contentRoot}/de/toc.json`
  try {
    const res = yield fetch(loc)
    const data = yield res.json()
    yield put(loadTocSuccess(data))
  } catch (err) {
    yield put(loadTocFailure(err))
  }
}

function* loadSectionSaga({ sectionId }) {
  const loc = `${contentRoot}/de/${sectionId}/content.json`
  try {
    const res = yield fetch(loc)
    if (res.status === 404) {
      // it's ok if content.json is not there
      yield put(loadSectionSuccess({
        id: sectionId,
        content: [],
      }))
    }
    const data = yield res.json()
    yield put(loadSectionSuccess({
      id: sectionId,
      content: data,
    }))
  } catch (err) {
    yield put(loadSectionFailure(err))
  }
}

function* rootSaga() {
  yield all([
    yield takeLatest(actionTypes.LOAD_TOC, loadTocSaga),
    yield takeLatest(actionTypes.LOAD_SECTION, loadSectionSaga),
  ])
}

export default rootSaga
