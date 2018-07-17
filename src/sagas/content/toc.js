import { fork, put, take } from 'redux-saga/effects'

import {
  actionTypes,
  loadTocSuccess,
  loadTocFailure,
} from '../../store/actions/content'
import { showMessage } from '../../store/actions/ui'

const contentRoot = process.env.CONTENT_ROOT

function* loadToc() {
  const url = `${contentRoot}/de/toc.json`
  try {
    const response = yield fetch(url)
    if (!response.ok) {
      throw new Error(`Could not fetch table of contents. (Status: ${response.status} URL: ${url})`)
    }
    const data = yield response.json()
    yield put(loadTocSuccess(data))
  } catch (err) {
    yield put(loadTocFailure(err))
    yield put(showMessage({
      title: 'Loading TOC failed!',
      msg: err.message,
      level: 'fatal',
    }))
  }
}

export default function* watchLoadToc() {
  while (true) {
    yield take(actionTypes.LOAD_TOC)
    yield fork(loadToc)
  }
}
