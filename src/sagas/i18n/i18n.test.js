import {
  call,
  put,
  take,
  takeLatest,
} from 'redux-saga/effects'

import watchI18nInstanceAvailable, { notifyI18next } from './i18n'
import { actionTypes, changeLanguage, i18nInstanceAvailable } from '../../store/actions/i18n'
import { toTwoLetterCode } from '../../lib/i18n'

const language = 'de'
const i18nMock = {
  changeLanguage: () => {},
  language,
}

describe('notifyI18next', () => {
  const gen = notifyI18next(i18nMock, changeLanguage(language))

  it('should notify i18n instance', () => {
    expect(gen.next().value).toEqual(call([i18nMock, i18nMock.changeLanguage], language))
    expect(gen.next().done).toEqual(true)
  })
})

describe('watchI18n', () => {
  const gen = watchI18nInstanceAvailable()

  it('should receive i18n instance, normalize language, put changeLanguage and takeLatest', () => {
    expect(gen.next().value).toEqual(take(actionTypes.I18N_INSTANCE_AVAILABLE))
    expect(gen.next(i18nInstanceAvailable(i18nMock)).value).toEqual(call(toTwoLetterCode, language))
    expect(gen.next(language).value).toEqual(put(changeLanguage(language)))
    expect(gen.next().value).toEqual(
      takeLatest(actionTypes.CHANGE_LANGUAGE, notifyI18next, i18nMock))
    expect(gen.next().done).toEqual(true)
  })
})
