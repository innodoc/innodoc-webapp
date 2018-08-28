import i18nReducer from './i18n'
import { changeLanguage } from '../actions/i18n'
import defaultInitialState from '../defaultInitialState'

describe('i18nReducer', () => {
  const initialState = defaultInitialState.i18n

  test('initialState', () => {
    expect(i18nReducer(undefined, {})).toEqual(initialState)
  })

  test('CHANGE_LANGUAGE', () => {
    expect(i18nReducer(initialState, changeLanguage('de'))).toEqual({ language: 'de' })
  })
})
