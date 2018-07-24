import { changeLanguage, i18nCreated } from './i18n'

test('CHANGE_LANGUAGE', () => {
  expect(changeLanguage('de')).toEqual({
    type: 'CHANGE_LANGUAGE',
    language: 'de',
  })
})

test('I18N_CREATED', () => {
  const mockI18n = { language: 'de' }
  expect(i18nCreated(mockI18n)).toEqual({
    type: 'I18N_CREATED',
    i18n: mockI18n,
  })
})
