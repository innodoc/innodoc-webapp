describe('Basic tests', () => {
  beforeAll(async () => {
    await page.goto(getUrl())
  })

  it('loads without error', async () => {
    expect.assertions(2)
    expect(await page.title()).toContain('innoDoc')
    await expect(page).toMatch('About')
  })

  it('should have a menu, footer and TOC', async () => {
    expect.assertions(6)
    await expect(page).toMatchElement('.ant-menu')
    await expect(page).toMatchElement('[class*=header___]')
    await expect(page).toMatchElement('[class*=footer___]')
    await expect(page).toMatchElement('[class*=content___]')
    await expect(page).toMatchElement('[class*=tocWrapper___]')
    await expect(page).toMatchElement('a', { text: 'Project structure' })
  })

  it('should be possible to go to another page', async () => {
    expect.assertions(2)
    await expect(page).toClick('a', { text: 'Project structure' })
    await expect(page).toMatchElement('h1', { text: 'Project structure' })
  })
})
