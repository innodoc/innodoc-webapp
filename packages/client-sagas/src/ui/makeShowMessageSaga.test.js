import { expectSaga } from 'redux-saga-test-plan'

import { showMessage } from '@innodoc/client-store/src/actions/ui'
import makeShowMessageSaga from './makeShowMessageSaga'

describe('makeShowMessageSaga', () => {
  it('should put showMessage', () => {
    const showMessageSaga = makeShowMessageSaga('error', 'testError', true)
    return expectSaga(showMessageSaga, {
      errorMsg: 'Test error',
    })
      .put(
        showMessage({
          closable: true,
          level: 'error',
          text: 'Test error',
          type: 'testError',
        })
      )
      .run()
  })
})
