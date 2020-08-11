beforeEach(resetBrowser)

describe('Basic layout', () => {
  it('should have a page title', async () => {
    await openUrl()
    expect(await browser.title()).toBe('About this course · innoDoc')
  })

  it('should have content', async () => {
    await openUrl()
    await browser.assert.exists('[class*=content___]')
    expect(await browser.text('h1')).toContain('About this course')
    expect(await browser.text('div')).toContain(
      'This content is a showcase for the innoDoc software package. It was ' +
        'developed at innoCampus, Technische Universität Berlin.'
    )
  })

  it('should have a header', async () => {
    await openUrl()
    await browser.assert.exists('[class*=header___] [class*=headerLogoWrapper___]')
    await browser.assert.exists('[class*=header___] [class*=ant-input-search]')
    await browser.assert.exists('[class*=header___] ul[class*=nav___] a[href="/page/about"]')
    await browser.assert.exists('[class*=header___] ul[class*=nav___] a[title="Download PDF"]')
    await browser.assert.exists(
      '//header[contains(@class, "header___")]//span[text()[contains(.,"Language")]]'
    )
    await browser.assert.exists(
      '//header[contains(@class, "header___")]//a[text()[contains(.,"Login")]]'
    )
  })

  it('should have a footer', async () => {
    await openUrl()
    await browser.assert.exists('[class*=footer___]')
    const segments = await browser.queryAll('[class*=footer___] [class*=footerSegment___]')
    expect(segments).toHaveLength(3)

    const heading1 = await segments[0].query('h4')
    expect(await browser.evaluate((el) => el.textContent, heading1)).toBe('innoDoc')
    expect(await segments[0].queryAll('a')).toHaveLength(4)

    const heading2 = await segments[1].query('h4')
    expect(await browser.evaluate((el) => el.textContent, heading2)).toBe('About this course')
    expect(await browser.evaluate((el) => el.textContent, segments[1])).toContain(
      'This content is a showcase'
    )

    const heading3 = await segments[2].query('h4')
    expect(await browser.evaluate((el) => el.textContent, heading3)).toBe('License')
    expect(await browser.evaluate((el) => el.textContent, segments[2])).toContain(
      'The components of this course are licensed under the'
    )
  })
})
