import { call, put, select } from 'redux-saga/effects'

import contentSelectors from '../../store/selectors/content'
import { loadManifestSuccess, loadManifestFailure } from '../../store/actions/content'
import { showMessage } from '../../store/actions/ui'
import { fetchManifest } from '../../lib/api'

export default function* loadManifestSaga() {
  let content
  // TODO: already in store?
  // let content = yield select(contentSelectors.getManifest)
  // if (content && content.length > 0) {
  //   yield put(loadManifestSuccess({ content }))
  // } else {
  // fetch from remote
  const contentRoot = yield select(contentSelectors.getContentRoot)
  try {
    content = yield call(fetchManifest, contentRoot)
    yield put(loadManifestSuccess(content))
  } catch (error) {
    yield put(loadManifestFailure({ error }))
    yield put(showMessage({
      title: 'Loading content manifest failed!',
      msg: error.message,
      level: 'fatal',
    }))
  }
  // }
}
