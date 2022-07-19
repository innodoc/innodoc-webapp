import { call, put } from 'redux-saga/effects'

import { loadManifestFailure, loadManifestSuccess } from '@innodoc/store/src/actions/content'
import { api } from '@innodoc/misc'

export default function* loadManifestSaga() {
  console.log('loadContentSaga')
  try {
    // Fetch from remote
    const manifest = yield call(api.fetchManifest)
    console.log('  loadContentSaga got manifest')
    yield put(loadManifestSuccess(manifest))
  } catch (error) {
    console.log('  loadContentSaga error', error)
    yield put(loadManifestFailure(error))
  }
}
