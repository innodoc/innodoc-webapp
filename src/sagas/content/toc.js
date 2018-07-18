import {
  call,
  fork,
  put,
  take,
} from 'redux-saga/effects'

import {
  actionTypes,
  loadTocSuccess,
  loadTocFailure,
} from '../../store/actions/content'
import { fetchToc } from '../../lib/api'
import { showMessage } from '../../store/actions/ui'

export function* loadToc() {
  const baseUrl = process.env.CONTENT_ROOT
  try {
    const data = yield call(fetchToc, baseUrl, 'de') // TODO: make language dynamic
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
