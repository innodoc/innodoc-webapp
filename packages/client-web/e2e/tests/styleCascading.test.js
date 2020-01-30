describe('Cascading should override Antd styles', () => {
  beforeEach(async () => {
    await page.goto(getUrl())
  })

  it('should have toggleButton w/o border', async () => {
    expect.assertions(1)
    const val = await page.$eval(
      '[class*=sidebarToggle] [class*=toggleButton]',
      (elem) => window.getComputedStyle(elem)['border-width']
    )
    expect(val).toBe('0px')
  })

  it('should have list item in footer w/o bottom border', async () => {
    expect.assertions(1)
    const val = await page.$eval(
      '[class*=footer] .ant-list-item',
      (elem) => window.getComputedStyle(elem)['border-bottom-width']
    )
    expect(val).toBe('0px')
  })
})
