describe('Initial smoke test', () => {
  const page = visit('/')

  it('loads without error', async () => {
    expect.assertions(1)
    const modalText = await page.extractText('.modal')
    expect(modalText.toLowerCase()).not.toContain('error')
  })

  it('should have a menu, footer and toc', async () => {
    expect.assertions(5)
    const title = await page.title()
    expect(title).toContain('innoDoc')
    expect(await page.exists('.ant-menu')).toEqual(true)
    expect(await page.exists('[class^=header]')).toEqual(true)
    expect(await page.exists('[class^=footer]')).toEqual(true)
    expect(await page.exists('[class^=content]')).toEqual(true)
  })
})
