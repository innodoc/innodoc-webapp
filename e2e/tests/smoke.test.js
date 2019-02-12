describe('Initial smoke test', () => {
  beforeAll(async () => {
    await page.goto(getUrl('/'))
  })

  it('loads without error', async () => {
    expect.assertions(2)
    expect(await page.title()).toContain('innoDoc')
    await expect(page).toMatch('About')
  })

  it('should have a menu, footer and TOC', async () => {
    expect.assertions(4)
    await expect(page).toMatchElement('.ant-menu')
    await expect(page).toMatchElement('[class^=header]')
    await expect(page).toMatchElement('[class^=footer]')
    await expect(page).toMatchElement('[class^=content]')
  })
})
