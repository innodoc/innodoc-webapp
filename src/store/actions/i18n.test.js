import { actionTypes, changeLanguage, i18nInstanceAvailable } from './i18n'

test('CHANGE_LANGUAGE', () => {
  expect(changeLanguage('de')).toEqual({
    type: actionTypes.CHANGE_LANGUAGE,
    language: 'de',
  })
})

test('I18N_INSTANCE_AVAILABLE', () => {
  const mockI18n = { language: 'de' }
  expect(i18nInstanceAvailable(mockI18n)).toEqual({
    type: actionTypes.I18N_INSTANCE_AVAILABLE,
    i18n: mockI18n,
  })
})
