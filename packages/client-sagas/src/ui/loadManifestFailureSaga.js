import { put } from 'redux-saga/effects'

import { showMessage } from '@innodoc/client-store/src/actions/ui'

export default function* loadManifestFailureSaga({ error }) {
  yield put(showMessage('error', 'loadManifestFailure', error.message))
}
