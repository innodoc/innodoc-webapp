beforeEach(resetBrowser)

describe('IndexPage', () => {
  it('shows an index and index terms', async () => {
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
})
