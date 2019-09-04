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

describe('Content translation', () => {
  it.each([
    ['en', 'Project structure'],
    ['de', 'Projektstruktur'],
  ])('should load content in language (%s)', async (lang, text) => {
    expect.assertions(1)
    await page.setExtraHTTPHeaders({ 'Accept-Language': lang })
    await page.goto(getUrl('/toc'))
    await expect(page).toMatchElement('a', { text })
  })

  it('should switch language w/o page reload', async () => {
    expect.assertions(6)
    // need to fit full nav to see language option
    await page.setViewport({ width: 1200, height: 600 })
    await page.goto(getUrl('/section/01-project'))
    await expect(page).toMatchElement('h1', { text: 'Project structure' })
    await expect(page).toMatchElement('p', { text: 'This sections describes the course structure.' })
    await expect(page).toClick('li', { text: 'Language' })
    await expect(page).toClick('li', { text: 'Deutsch' })
    await expect(page).toMatchElement('h1', { text: 'Projektstruktur' })
    await expect(page).toMatchElement('p', { text: 'Dieser Abschnitt bespricht die Stuktur eines Kurses.' })
  })
})

describe.each(['en', 'de'])('Language detection (%s)', (lang) => {
  describe('Accept-Language header', () => {
    beforeEach(async () => {
      await page.setExtraHTTPHeaders({ 'Accept-Language': lang })
      await page.goto(getUrl())
    })

    it('should set cookie', async () => {
      expect.assertions(1)
      const cookies = await page.cookies()
      const cookieLang = cookies.find((c) => c.name === COOKIE_NAME).value
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
