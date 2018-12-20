describe('Error conditions', () => {
  test.each(['/path-does-not-exist', '/page', '/page/', '/page/does-not-exist'])(
    'receives 404 for URL: %s', async (url) => {
      const page = visit(url)
      expect((await page).code).toEqual(404)
    }
  )

  it('should show "Not found" also client-side', async () => {
    const page = visit('/page/02-elements/03-links-and-formatting')
    page.click('[href*=does-not-exist]')
    const modalText = await page.extractText('.ant-alert')
    expect(modalText).toContain('404')
  })
})
