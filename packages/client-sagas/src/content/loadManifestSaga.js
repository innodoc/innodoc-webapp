import { call, put } from 'redux-saga/effects'

import { loadManifestFailure, loadManifestSuccess } from '@innodoc/client-store/src/actions/content'
import { fetchManifest } from '@innodoc/client-misc/src/api'

export default function* loadManifestSaga({ contentRoot }) {
  try {
    // Fetch from remote
    const manifest = yield call(fetchManifest, contentRoot)
    yield put(loadManifestSuccess(manifest))
  } catch (error) {
    yield put(loadManifestFailure(error))
  }
}
