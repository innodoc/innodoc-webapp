import { put } from 'redux-saga/effects'

import { showMessage } from '@innodoc/client-store/src/actions/ui'

const makeShowMessageSaga = (level, type, closable) =>
  function* showMessageSaga({ errorMsg }) {
    yield put(
      showMessage({
        closable,
        level,
        text: errorMsg,
        type,
      })
    )
  }

export default makeShowMessageSaga
