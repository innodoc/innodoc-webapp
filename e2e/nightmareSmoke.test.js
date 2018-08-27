describe('When visiting innoDoc webapp', () => {
  it('loads', async () => {
    const page = visit('/')

    console.log('0')

    const title = await page.title()
    expect(title).toContain('innoDoc')

    console.log('1')

    const menuItemExists = await page.exists('.header.item')
    expect(menuItemExists).toEqual(true)

    console.log('2')

    const text = await page.evaluate(() => document.body.textContent).end()
    expect(text).toContain('Preparatory Mathematics')
    console.log('3')
  })

  xit('should have a menu, footer and toc', () => {})
  xit('should create a language cookie', () => {})
})
