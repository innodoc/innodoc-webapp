describe('IndexPage', () => {
  it('shows an index and index terms', async () => {
    expect.assertions(4)
    await page.goto(getUrl('index-page'))
    await expect(page).toMatchElement('h1', { text: 'Index' })
    const row = await expect(page).toMatchElement('li', { text: 'Markdown' })
    await expect(row).toMatchElement('a', { text: 'Project structure' })
    await expect(row).toMatchElement('a', { text: 'Content files' })
  })
})
