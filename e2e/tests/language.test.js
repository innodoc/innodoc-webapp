const COOKIE_NAME = 'next-i18next'

const getPageLang = async () => {
  const htmlEl = await page.$('html')
  const langAttr = await htmlEl.getProperty('lang')
  const value = await langAttr.jsonValue()
  return value.substring(0, 2)
}

const resetLanguage = async () => {
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US' })
  await page.deleteCookie({ name: COOKIE_NAME, url: getUrl() })
}

beforeEach(resetLanguage)
afterAll(resetLanguage)

describe.each([
  ['en', 'Project structure'],
  ['de', 'Projektstruktur'],
])(
  'Content translation (%s)', (lang, text) => {
    it('should show content in language', async () => {
      expect.assertions(1)
      await page.setExtraHTTPHeaders({ 'Accept-Language': lang })
      await page.goto(getUrl())
      await expect(page).toMatchElement('a', { text })
    })
  }
)

describe.each(['en', 'de'])('Language detection (%s)', (lang) => {
  describe('Accept-Language header', () => {
    beforeEach(async () => {
      await page.setExtraHTTPHeaders({ 'Accept-Language': lang })
      await page.goto(getUrl())
    })

    it('should set cookie', async () => {
      expect.assertions(1)
      const cookies = await page.cookies()
      const cookieLang = cookies.find(c => c.name === COOKIE_NAME).value
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
    await page.setCookie({ name: COOKIE_NAME, url: getUrl(), value: lang })
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'ru' })
    const pageLang = await getPageLang()
    expect(pageLang).toEqual(lang)
  })
})
