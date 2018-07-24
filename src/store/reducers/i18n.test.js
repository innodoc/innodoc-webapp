import i18nReducer, { selectors } from './i18n'
import { changeLanguage } from '../actions/i18n'
import defaultInitialState from '../defaultInitialState'

describe('i18nSelectors', () => {
  const state = { i18n: { language: 'en' } }

  test('getLanguage', () => {
    expect(selectors.getLanguage(state)).toEqual('en')
  })
})

describe('i18nReducer', () => {
  const initialState = defaultInitialState.i18n

  test('initialState', () => {
    expect(i18nReducer(undefined, {})).toEqual(initialState)
  })

  test('CHANGE_LANGUAGE', () => {
    expect(i18nReducer(initialState, changeLanguage('de'))).toEqual({ language: 'de' })
  })
})
