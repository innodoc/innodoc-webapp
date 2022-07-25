import { call, put } from 'redux-saga/effects'

import { loadManifestFailure, loadManifestSuccess } from '@innodoc/store/actions/content'
import { fetchManifest } from '@innodoc/misc/api'

export default function* loadManifestSaga() {
  console.log('loadContentSaga')
  try {
    // Fetch from remote
    const manifest = yield call(fetchManifest)
    console.log('  loadContentSaga got manifest')
    yield put(loadManifestSuccess(manifest))
  } catch (error) {
    console.log('  loadContentSaga error', error)
    yield put(loadManifestFailure(error))
  }
}
