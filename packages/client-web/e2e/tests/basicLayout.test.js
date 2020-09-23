beforeEach(async () => {
  await jestPlaywright.resetContext()
})

describe('Basic layout', () => {
  it('should have a page title', async () => {
    await helpers.goto()
    await page.waitForSelector('"About this course"')
    expect(await page.title()).toBe('About this course · innoDoc')
  })

  it('should have content', async () => {
    await helpers.goto()
    await page.waitForSelector('h1 >> "About this course"')
    await expect(page).toHaveText(
      '[class*=content___]',
      'This content is a showcase for the innoDoc software package'
    )
    await expect(page).toHaveText('[class*=content___]', 'It was developed at innoCampus')
    await expect(page).toHaveText('[class*=content___]', 'It is used for automated software tests.')
  })

  it('should have a header', async () => {
    await helpers.goto()
    await page.waitForSelector('header [class*=headerLogoWrapper___]')
    await page.waitForSelector('header [class*=ant-input-search]')
    await page.waitForSelector('header >> "About"')
    await page.waitForSelector('header ul[class*=nav___] a[href="/page/about"]')
    await page.waitForSelector('header >> "PDF"')
    await page.waitForSelector('header ul[class*=nav___] a[title="Download PDF"]')
    await page.waitForSelector('header >> "Language"')
    await page.waitForSelector('header >> "Progress"')
    await page.waitForSelector('header >> "Login"')
  })

  it('should have a footer', async () => {
    await helpers.goto()
    await page.waitForSelector('footer')
    const segments = await page.$$('footer [class*=footerSegment___]')
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
