import {
  call,
  fork,
  getContext,
  setContext,
  put,
  take,
} from 'redux-saga/effects'

import watchI18n, { watchChangeLanguage } from './i18n'
import { actionTypes, changeLanguage } from '../store/actions/i18n'

const language = 'de'
const mockI18n = {
  changeLanguage: () => {},
  language,
}

describe('watchChangeLanguage', () => {
  const gen = watchChangeLanguage()

  it('should notify i18n on CHANGE_LANGUAGE', () => {
    expect(gen.next().value).toEqual(take(actionTypes.CHANGE_LANGUAGE))
    expect(gen.next({ language }).value).toEqual(getContext('i18n'))
    expect(gen.next(mockI18n).value).toEqual(call([mockI18n, mockI18n.changeLanguage], language))
  })
})

describe('watchI18n', () => {
  const gen = watchI18n()

  it('should wait for i18n instance, fork watchChangeLanguage and put changeLanguage', () => {
    expect(gen.next().value).toEqual(take(actionTypes.I18N_CREATED))
    expect(gen.next({ i18n: mockI18n }).value).toEqual(setContext({ i18n: mockI18n }))
    expect(gen.next().value).toEqual(fork(watchChangeLanguage))
    expect(gen.next().value).toEqual(put(changeLanguage(mockI18n.language)))
  })
})
