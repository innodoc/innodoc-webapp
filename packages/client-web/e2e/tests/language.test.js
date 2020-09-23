describe('Content translation', () => {
  it.each([
    ['en', 'Table of contents', '1 Project structure'],
    ['de', 'Inhaltsverzeichnis', '1 Projektstruktur'],
  ])('should load content in language (%s)', async (lang, tocText, linkText) => {
    await jestPlaywright.resetContext({ extraHTTPHeaders: { 'Accept-Language': lang } })
    await helpers.goto('toc')
    await page.waitForSelector(`[class*=content___] h1 >> "${tocText}"`)
    await page.waitForSelector(`[class*=content___] >> "${linkText}"`)
    expect(await page.title()).toBe(`${tocText} · innoDoc`)
  })

  it('should switch language w/o page reload', async () => {
    await jestPlaywright.resetContext()
    await helpers.goto('section/01-project')
    await page.waitForSelector('[class*=content___] h1 >> "1 Project structure"')
    expect(await page.title()).toBe('1 Project structure · innoDoc')
    await expect(page).toHaveText(
      '[class*=content___]',
      'A course consists of a number of chapters, sections and subsections.'
    )
    await helpers.clickNavSubmenu('Language', 'Deutsch')
    await page.waitForSelector('[class*=content___] h1 >> "1 Projektstruktur"')
    expect(await page.title()).toBe('1 Projektstruktur · innoDoc')
    await expect(page).toHaveText(
      '[class*=content___]',
      'Ein Kurs besteht aus einer Anzahl von Kapiteln'
    )
  })
})

describe.each(['en', 'de'])('Language detection (%s)', (lang) => {
  it('should set lang attribute and cookie', async () => {
    await jestPlaywright.resetContext({ extraHTTPHeaders: { 'Accept-Language': lang } })
    await helpers.goto()
    expect(await page.getAttribute('html', 'lang')).toBe(lang)
    const cookie = await helpers.getCookie('next-i18next')
    expect(cookie.value).toBe(lang)
  })

  test('cookie should override header', async () => {
    await jestPlaywright.resetContext({ extraHTTPHeaders: { 'Accept-Language': 'ru' } })
    await context.addCookies([
      {
        name: 'next-i18next',
        url: helpers.getUrl(),
        value: lang,
      },
    ])
    await helpers.goto()
    expect(await page.getAttribute('html', 'lang')).toBe(lang)
  })
})
