beforeAll(async () => {
  await jestPlaywright.resetContext()
  await helpers.goto()
})

describe('Basic layout', () => {
  it('should have a page title', async () => {
    expect(await page.title()).toBe('About this course · innoDoc')
    const h1 = await page.waitForSelector('h1')
    await expect(h1).toHaveText('About this course')
  })

  it('should have content', async () => {
    const content = await page.waitForSelector('[class*=content___]')
    await expect(content).toHaveText('This content is a showcase for the innoDoc software package')
    await expect(content).toHaveText('It was developed at innoCampus')
    await expect(content).toHaveText('It is used for automated software tests.')
  })

  it('should have a header', async () => {
    const header = await page.waitForSelector('header')
    await header.waitForSelector('[class*=headerLogoWrapper___]')
    await expect(header).toHaveText('About')
    await header.waitForSelector('a[href="/page/about"]')
    await expect(header).toHaveText('Progress')
    await header.waitForSelector('a[href="/progress"]')
    await expect(header).toHaveText('Language')
    await expect(header).toHaveText('Account')
  })

  it('should have a footer', async () => {
    const footer = await page.waitForSelector('footer')
    const segments = await footer.$$('[class*=footerSegment___]')
    expect(segments).toHaveLength(3)

    const heading1 = await segments[0].$('h4')
    expect(await heading1.textContent()).toBe('innoDoc')
    expect(await segments[0].$$('a')).toHaveLength(4)

    const heading2 = await segments[1].$('h4')
    expect(await heading2.textContent()).toBe('About this course')
    expect(await segments[1].textContent()).toContain('This content is a showcase')

    const heading3 = await segments[2].$('h4')
    expect(await heading3.textContent()).toBe('License')
    expect(await segments[2].textContent()).toContain(
      'The components of this course are licensed under the'
    )
  })
})
