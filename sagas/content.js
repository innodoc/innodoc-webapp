import { put } from 'redux-saga/effects'
import 'isomorphic-unfetch'

import {
  loadTocSuccess,
  loadTocFailure,
  loadSectionSuccess,
  loadSectionFailure,
} from '../store/actions/content'

const contentRoot = process.env.CONTENT_ROOT

export function* loadTocSaga() {
  const loc = `${contentRoot}/de/toc.json`
  try {
    const res = yield fetch(loc)
    const data = yield res.json()
    yield put(loadTocSuccess(data))
  } catch (err) {
    yield put(loadTocFailure(err))
  }
}

export function* loadSectionSaga({ sectionId }) {
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
