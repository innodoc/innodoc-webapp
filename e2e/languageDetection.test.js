describe('Language detection', () => {
  test.each(['en', 'de'])(
    'should set lang and cookie if Accept-Language: %s', async (lang) => {
      expect.assertions(2)
      const page = visit('/', { 'Accept-Language': lang })
      const { value: cookieLang } = await page.cookies.get({ name: 'i18next' })
      expect(cookieLang).toEqual(lang)
      expect(await page.getLangTag()).toEqual(lang)
    }
  )

  it('cookie should override header', async () => {
    expect.assertions(1)
    const page = visit('/', { 'Accept-Language': 'en' }, { name: 'i18next', value: 'de' })
    expect(await page.getLangTag()).toEqual('de')
  })
})
