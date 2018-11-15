import { call, put, select } from 'redux-saga/effects'

import appSelectors from '../../store/selectors/app'
import { loadManifestSuccess, loadManifestFailure } from '../../store/actions/content'
import { showMessage } from '../../store/actions/ui'
import { fetchManifest } from '../../lib/api'

export default function* loadManifestSaga() {
  const title = yield select(appSelectors.getTitle)
  if (title) {
    yield put(loadManifestSuccess({ parsed: true }))
  } else {
    // fetch from remote
    const contentRoot = yield select(appSelectors.getContentRoot)
    try {
      const content = yield call(fetchManifest, contentRoot)
      yield put(loadManifestSuccess({ content, parsed: false }))
    } catch (error) {
      yield put(loadManifestFailure({ error }))
      yield put(showMessage({
        title: 'Loading content manifest failed!',
        msg: error.message,
        level: 'fatal',
      }))
    }
  }
}
