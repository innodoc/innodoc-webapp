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
  loadSectionSuccess,
  loadSectionFailure,
} from '../../store/actions/content'
import { fetchSection } from '../../lib/api'
import { showMessage } from '../../store/actions/ui'

export function* loadSection({ id }) {
  // query cache
  let content = yield select(selectors.getSectionContent, id)
  if (content) {
    yield put(loadSectionSuccess({ id, content }))
  } else {
    // fetch from remote
    try {
      content = yield call(fetchSection, id, 'de') // TODO: make language dynamic
      yield put(loadSectionSuccess({ id, content }))
    } catch (err) {
      yield put(loadSectionFailure(err))
      yield put(showMessage({
        title: 'Loading section failed!',
        msg: err.message,
        level: 'error',
      }))
    }
  }
}

export default function* watchLoadSection() {
  while (true) {
    const id = yield take(actionTypes.LOAD_SECTION)
    yield fork(loadSection, id)
  }
}
