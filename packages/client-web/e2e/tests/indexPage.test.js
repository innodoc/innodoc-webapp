beforeEach(async () => {
  await jestPlaywright.resetContext()
})

describe('IndexPage', () => {
  it('should show an index and index terms', async () => {
    await helpers.goto('index-page')
    expect(await page.title()).toBe('Index · innoDoc')
    await page.waitForSelector('[class^=content___] h1', '"Index"')
    const entries = await page.$$('[class^=content___] .ant-list li.ant-list-item')
    expect(entries.length).toBeGreaterThan(5)
    await page.waitForSelector('[class^=content___] span >> "Markdown"')
    await page.waitForSelector('[class^=content___] >> "1 Project structure"')
    await page.waitForSelector('[class^=content___] >> "1.2.2 Content files"')
  })

  it('should filter term list', async () => {
    await helpers.goto('index-page')
    await page.type('input[placeholder="Search keyword…"]', 'table of contents')
    const entries = await page.$$('[class^=content___] .ant-list li.ant-list-item')
    const visibleEntries = await Promise.all(entries.map((e) => e.boundingBox()))
    expect(visibleEntries.filter(Boolean)).toHaveLength(1)
  })

  it('should should have same term count for each language', async () => {
    await helpers.goto('index-page')
    let items = await page.$$('div[class^=content___] li.ant-list-item')
    const enCount = items.length
    await jestPlaywright.resetContext({ extraHTTPHeaders: { 'Accept-Language': 'de' } })
    await helpers.goto('index-page')
    items = await page.$$('div[class^=content___] li.ant-list-item')
    const deCount = items.length
    expect(enCount).toBe(deCount)
  })
})
