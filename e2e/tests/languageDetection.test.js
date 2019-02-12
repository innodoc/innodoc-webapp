const getPageLang = async () => {
  const htmlEl = await page.$('html')
  const langAttr = await htmlEl.getProperty('lang')
  const value = await langAttr.jsonValue()
  return value
}

describe.each(['en', 'de'])('Language detection (%s)', (lang) => {
  describe('Accept-Language header', () => {
    beforeEach(async () => {
      await page.deleteCookie({ name: 'i18next', url: getUrl('') })
      await page.setExtraHTTPHeaders({ 'Accept-Language': lang })
      await page.goto(getUrl('/'))
    })

    it('should set cookie', async () => {
      expect.assertions(1)
      const cookies = await page.cookies()
      const cookieLang = cookies.find(c => c.name === 'i18next').value
      expect(cookieLang).toEqual(lang)
    })

    it('should set lang attribute', async () => {
      expect.assertions(1)
      const pageLang = await getPageLang()
      expect(pageLang).toEqual(lang)
    })
  })

  test('cookie should override header', async () => {
    expect.assertions(1)
    await page.setCookie({ name: 'i18next', url: getUrl(''), value: lang })
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'ru' })
    const pageLang = await getPageLang()
    expect(pageLang).toEqual(lang)
  })
})
