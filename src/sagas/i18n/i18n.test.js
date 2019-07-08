import { expectSaga } from 'redux-saga-test-plan'

import { notifyI18next, waitForDetectedLanguage } from './i18n'
import { changeLanguage, languageDetected } from '../../store/actions/i18n'
import { toTwoLetterCode } from '../../lib/util'
import nextI18next from '../../lib/i18n'

jest.mock('../../lib/i18n', () => ({
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
