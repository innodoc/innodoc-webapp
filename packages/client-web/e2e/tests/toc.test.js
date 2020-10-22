beforeEach(async () => {
  await jestPlaywright.resetContext()
})

describe('TOC', () => {
  it('should have working section link', async () => {
    await helpers.goto()
    await page.click('[class*=content___] button[title="Show table of contents"]')
    await page.waitForSelector('aside >> "1 Project structure"')
    await page.waitForSelector('aside >> "2 Content elements"')
    await page.click('aside a[href="/section/01-project"]')
    await page.waitForSelector('h1 >> "1 Project structure"')
  })

  it('should have collapsible nodes', async () => {
    await helpers.goto('section/01-project')
    await page.click('[class*=content___] button[title="Show table of contents"]')
    await Promise.all(
      [
        '1 Project structure',
        '1.1 Folders',
        '1.2 Files',
        '1.3 Languages',
        '1.4 Building',
        '2 Content elements',
      ].map((text) => page.waitForSelector(`aside >> "${text}"`))
    )
    await Promise.all(
      ['1.2.1 manifest.yml', '1.2.2 Content files'].map((text) =>
        expect(page).not.toHaveText('aside', text)
      )
    )

    expect(await page.$$('aside .ant-tree-switcher')).toHaveLength(6)
    expect(await page.$$('aside .ant-tree-switcher_open')).toHaveLength(1)
    expect(await page.$$('aside .ant-tree-switcher_close')).toHaveLength(2)

    await page.click('aside >> "1.2 Files"')
    await expect(page).toEqualText('h1', '1.2 Files')

    expect(await page.$$('aside .ant-tree-switcher')).toHaveLength(8)
    expect(await page.$$('aside .ant-tree-switcher_open')).toHaveLength(2)
    expect(await page.$$('aside .ant-tree-switcher_close')).toHaveLength(1)

    await Promise.all(
      ['1.2.1 manifest.yml', '1.2.2 Content files'].map((text) =>
        expect(page).toHaveText('aside', text)
      )
    )
  })

  it('should respond to section change', async () => {
    await helpers.goto('section/01-project/04-building')
    await page.click('[class*=content___] button[title="Show table of contents"]')
    expect(await page.$$('aside .ant-tree-switcher')).toHaveLength(6)
    await page.click('[class*=sectionAffix___] button[title="2 Content elements"]')
    await page.waitForSelector('h1 >> "2 Content elements"')
    expect(await page.$$('aside .ant-tree-switcher')).toHaveLength(17)
  })

  it('should be toggleable using content button', async () => {
    await helpers.goto()
    await page.waitForSelector('aside', { state: 'hidden' })
    const toggleButton = await page.$('[class*=content___] button[title="Show table of contents"]')
    await toggleButton.click()
    await page.waitForSelector('aside')
    await toggleButton.click()
    await page.waitForSelector('aside', { state: 'hidden' })
  })

  it('should be closeable using sider button', async () => {
    await helpers.goto()
    await page.waitForSelector('aside', { state: 'hidden' })
    await page.click('[class*=content___] button[title="Show table of contents"]')
    await page.waitForSelector('aside')
    await page.click('aside [title="Close table of contents"]')
    await page.waitForSelector('aside', { state: 'hidden' })
  })
})
