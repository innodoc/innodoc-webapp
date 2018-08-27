describe('When visiting innoDoc webapp', () => {
  it('loads', async () => {
    const page = visit('/')

    const title = await page.title()
    expect(title).toContain('innoDoc')

    const menuItemExists = await page.exists('.header.item')
    expect(menuItemExists).toEqual(true)

    const text = await page.evaluate(() => document.body.textContent).end()
    expect(text).toContain('Preparatory Mathematics')
  })

  xit('should have a menu, footer and toc', () => {})
  xit('should create a language cookie', () => {})
})
