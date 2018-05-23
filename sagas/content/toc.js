import { fork, put, take } from 'redux-saga/effects'

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
  while (true) {
    yield take(actionTypes.LOAD_TOC)
    yield fork(loadToc)
  }
}
