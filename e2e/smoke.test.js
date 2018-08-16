describe('Initial smoke test', () => {
  const page = visit('/')

  it('loads without error', async () => {
    const modalText = await page.extractText('.modal')
    expect(modalText.toLowerCase()).not.toContain('error')
  })

  it('should have a menu, footer and toc', async () => {
    const title = await page.title()

    expect(title).toContain('innoDoc')
    expect(await page.exists('.header.item')).toEqual(true)

    const menuText = await page.extractText('.ui.stackable.menu .header.item:first-child')
    expect(menuText).toContain('Preparatory Mathematics')
  })
})
