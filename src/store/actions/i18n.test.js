import { actionTypes, changeLanguage, languageDetected } from './i18n'

test('CHANGE_LANGUAGE', () => {
  expect(changeLanguage('de')).toEqual({
    type: actionTypes.CHANGE_LANGUAGE,
    language: 'de',
  })
})

test('LANGUAGE_DETECTED', () => {
  expect(languageDetected('en-US')).toEqual({
    type: actionTypes.LANGUAGE_DETECTED,
    language: 'en-US',
  })
})
