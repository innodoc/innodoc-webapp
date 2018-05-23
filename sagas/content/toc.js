import { put, takeLatest } from 'redux-saga/effects'
import 'isomorphic-unfetch'

import {
  actionTypes,
  loadTocSuccess,
  loadTocFailure,
} from '../../store/actions/content'

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

export default function* watchLoadToc() {
  yield takeLatest(actionTypes.LOAD_TOC, loadToc)
}
