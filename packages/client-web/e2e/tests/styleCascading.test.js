beforeEach(resetBrowser)

describe('Cascading should override Antd styles', () => {
  it('should have list item in footer w/o bottom border', async () => {
    await openUrl()
    await browser.assert.style('[class*=footer] .ant-list-item', 'border-bottom-width', '0px')
  })
})
