import {
  call,
  fork,
  put,
  select,
  take,
} from 'redux-saga/effects'

import { selectors } from '../../store/reducers/content'
import {
  actionTypes,
  loadTocSuccess,
  loadTocFailure,
} from '../../store/actions/content'
import { fetchToc } from '../../lib/api'
import { showMessage } from '../../store/actions/ui'

export function* loadToc() {
  // query cache
  let content = yield select(selectors.getToc)
  if (content) {
    yield put(loadTocSuccess(content))
  } else {
    // fetch from remote
    try {
      content = yield call(fetchToc, 'de') // TODO: make language dynamic
      yield put(loadTocSuccess(content))
    } catch (err) {
      yield put(loadTocFailure(err))
      yield put(showMessage({
        title: 'Loading TOC failed!',
        msg: err.message,
        level: 'fatal',
      }))
    }
  }
}

export default function* watchLoadToc() {
  while (true) {
    yield take(actionTypes.LOAD_TOC)
    yield fork(loadToc)
  }
}
