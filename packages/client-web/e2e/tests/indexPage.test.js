beforeEach(resetBrowser)

describe('IndexPage', () => {
  it('should show an index and index terms', async () => {
    await openUrl('index-page')
    const content = await browser.query('div[class^=content___]')
    const [h1] = await browser.findByText(content, 'Index')
    expect(await browser.tag(h1)).toBe('h1')
    const list = await browser.query(content, '.ant-list')
    const entries = await browser.queryAll(list, 'li.ant-list-item')
    expect(entries.length).toBeGreaterThan(5)
    const [markdownSpan] = await browser.findByText(list, 'Markdown')
    expect(await browser.tag(markdownSpan)).toBe('span')
    const [link1] = await browser.findByText(list, '1 Project structure')
    expect(await browser.tag(link1)).toBe('a')
    const [link2] = await browser.findByText(list, '1.2.2 Content files')
    expect(await browser.tag(link2)).toBe('a')
  })

  it('should filter term list', async () => {
    await openUrl('index-page')
    const allCount = (
      await browser.queryAll('div[class^=content___] li.ant-list-item')
    ).length
    await browser.waitAndType(
      'div[class^=content___] input',
      'table of contents'
    )
    await browser.wait(500)
    const entries = await browser.queryAll(
      'div[class^=content___] li.ant-list-item'
    )
    const entriesVisible = await Promise.all(
      entries.map((entry) =>
        browser.evaluate((el) => WendigoUtils.isVisible(el), entry)
      )
    )
    const visible = entriesVisible.filter((v) => v)
    const notVisible = entriesVisible.filter((v) => !v)
    expect(visible).toHaveLength(1)
    expect(notVisible).toHaveLength(allCount - 1)
  })

  it('should should have same term count for each language', async () => {
    await openUrl('index-page', { headers: { 'Accept-Language': 'en' } })
    const enCount = (
      await browser.queryAll('div[class^=content___] li.ant-list-item')
    ).length
    await resetBrowser()
    await openUrl('index-page', { headers: { 'Accept-Language': 'de' } })
    const deCount = (
      await browser.queryAll('div[class^=content___] li.ant-list-item')
    ).length
    expect(enCount).toBe(deCount)
  })
})
