beforeEach(async () => {
  await jestPlaywright.resetContext()
})

describe('Cascading should override Antd styles', () => {
  it('should have list item in footer w/o bottom border', async () => {
    await helpers.goto()
    const borderBottomWidth = await page.$eval(
      '[class*=footer___] .ant-list-item',
      (el) => el.computedStyleMap().get('border-bottom-width').value
    )
    expect(borderBottomWidth).toBe(0)
  })
})
