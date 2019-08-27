import { expectSaga } from 'redux-saga-test-plan'

import { changeLanguage, languageDetected } from '@innodoc/client-store/src/actions/i18n'
import { toTwoLetterCode } from '@innodoc/client-misc/src/util'
import nextI18next from '@innodoc/client-misc/src/i18n'

import { notifyI18next, waitForDetectedLanguage } from './i18n'

jest.mock('@innodoc/client-misc/src/i18n', () => ({
  i18n: { changeLanguage: () => {} },
}))

describe('notifyI18next', () => {
  it('should notify i18next',
    () => expectSaga(notifyI18next, changeLanguage('de', 'en'))
      .call([nextI18next.i18n, nextI18next.i18n.changeLanguage], 'de')
      .run()
  )
})

describe('waitForDetectedLanguage', () => {
  it('should wait for the i18n instance',
    () => expectSaga(waitForDetectedLanguage)
      .dispatch(languageDetected('en-US'))
      .call(toTwoLetterCode, 'en-US')
      .put(changeLanguage('en'))
      .run()
  )
})
