import { put } from 'redux-saga/effects'

import { showMessage } from '@innodoc/client-store/src/actions/ui'

export default function* loadContentFailureSaga({ error }) {
  yield put(showMessage('error', 'loadContentFailure', error.message))
}
