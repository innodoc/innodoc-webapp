beforeEach(resetBrowser)

describe('Content translation', () => {
  it.each([
    ['en', 'Table of contents', '1 Project structure'],
    ['de', 'Inhaltsverzeichnis', '1 Projektstruktur'],
  ])('should load content in language (%s)', async (lang, tocText, linkText) => {
    await openUrl('toc', { headers: { 'Accept-Language': lang } })
    expect(await browser.title()).toBe(`${tocText} · innoDoc`)
    await browser.assert.text('h1', tocText)
    await browser.assert.text('a', linkText)
  })

  it('should switch language w/o page reload', async () => {
    await openUrl('section/01-project')
    expect(await browser.title()).toBe('1 Project structure · innoDoc')
    await browser.assert.text('h1', '1 Project structure')
    await browser.assert.textContains(
      'div',
      'A course consists of a number of chapters, sections and subsections.'
    )
    await hoverNavItem('Language')
    await browser.waitForText('Deutsch')
    await browser.clickText('Deutsch')
    await browser.waitForText('1 Projektstruktur')
    await browser.waitFor(
      () =>
        document.evaluate(
          '//div[text()[contains(.,"Ein Kurs besteht aus einer Anzahl von Kapiteln")]]',
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue
    )
    expect(await browser.title()).toBe('1 Projektstruktur · innoDoc')
  })
})

describe.each(['en', 'de'])('Language detection (%s)', (lang) => {
  it('should set lang attribute and cookie', async () => {
    await openUrl('', { headers: { 'Accept-Language': lang } })
    await browser.assert.cookies('next-i18next', lang)
    await browser.assert.attribute('html', 'lang', lang)
  })

  test('cookie should override header', async () => {
    await browser.cookies.set('next-i18next', {
      url: getUrl(),
      value: lang,
    })
    await openUrl('', { headers: { 'Accept-Language': 'ru' } })
    await browser.assert.attribute('html', 'lang', lang)
  })
})
