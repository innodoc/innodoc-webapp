describe('TOC', () => {
  it('should have sidebar with TOC and working link', async () => {
    expect.assertions(3)
    await page.goto(getUrl())
    await expect(page).toClick('[class*=sidebarToggle] button')
    await page.waitFor(500)
    await expect(page).toClick('a', { text: 'Project structure' })
    await expect(page).toMatchElement('h1', { text: 'Project structure' })
  })
})
