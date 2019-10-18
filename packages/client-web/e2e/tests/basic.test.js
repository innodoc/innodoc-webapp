describe('Basic tests', () => {
  beforeEach(async () => {
    await page.goto(getUrl())
  })

  it('should load without error', async () => {
    expect.assertions(2)
    expect(await page.title()).toContain('innoDoc')
    await expect(page).toMatchElement('h1', { text: 'About this course' })
  })

  it('should have a header, footer and menu', async () => {
    expect.assertions(4)
    await expect(page).toMatchElement('.ant-menu')
    await expect(page).toMatchElement('[class*=header___]')
    await expect(page).toMatchElement('[class*=footer___]')
    await expect(page).toMatchElement('[class*=content___]')
  })
})
