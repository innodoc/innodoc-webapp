import { put, takeLatest } from 'redux-saga/effects'
import 'isomorphic-unfetch'

import {
  actionTypes,
  loadTocSuccess,
  loadTocFailure,
  loadSectionSuccess,
  loadSectionFailure,
} from '../store/actions/content'

const contentRoot = process.env.CONTENT_ROOT

function* loadToc() {
  const loc = `${contentRoot}/de/toc.json`
  try {
    const res = yield fetch(loc)
    const data = yield res.json()
    yield put(loadTocSuccess(data))
  } catch (err) {
    yield put(loadTocFailure(err))
  }
}

export function* loadTocWatcher() {
  yield takeLatest(actionTypes.LOAD_TOC, loadToc)
}

function* loadSection({ sectionId }) {
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

export function* loadSectionWatcher() {
  yield takeLatest(actionTypes.LOAD_SECTION, loadSection)
}
