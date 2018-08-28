import selectors from './i18n'

describe('i18nSelectors', () => {
  const state = { i18n: { language: 'en' } }

  test('getLanguage', () => {
    expect(selectors.getLanguage(state)).toEqual('en')
  })
})
