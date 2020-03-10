import { put } from 'redux-saga/effects'

import { showMessage } from '@innodoc/client-store/src/actions/ui'

const makeShowMessageSaga = (level, type, closable) =>
  function* showMessageSaga({ error }) {
    yield put(
      showMessage({
        closable,
        level,
        text: error.message,
        type,
      })
    )
  }

export default makeShowMessageSaga
