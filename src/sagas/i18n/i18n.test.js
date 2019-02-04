import { expectSaga } from 'redux-saga-test-plan'

import watchI18nInstanceAvailable, { notifyI18next } from './i18n'
import { changeLanguage, i18nInstanceAvailable } from '../../store/actions/i18n'

const language = 'de-DE'
const i18nMock = {
  changeLanguage: () => {},
  language,
}

describe('notifyI18next', () => {
  it('should notify i18next', () => expectSaga(notifyI18next, i18nMock, changeLanguage(language))
    .call([i18nMock, i18nMock.changeLanguage], language)
    .run()
  )
})

describe('watchI18nInstanceAvailable', () => {
  it('should wait for the i18n instance', () => expectSaga(watchI18nInstanceAvailable)
    .dispatch(i18nInstanceAvailable(i18nMock))
    .put(changeLanguage('de'))
    .dispatch(changeLanguage('en')) // trigger takeLatest once more
    .silentRun(0)
    // check takeLatest is working
    .then(({ effects }) => expect(effects.fork).toHaveLength(3))
  )
})
