beforeEach(async () => {
  await jestPlaywright.resetContext()
})

describe('404', () => {
  describe('server', () => {
    test.each([
      'path-does-not-exist',
      'page',
      'page/does-not-exist',
      'section',
      'section/does-not-exist',
    ])('%s', async (path) => {
      await helpers.goto(path)
      await expect(page).toHaveText(
        '[class*=content___] .ant-result',
        'This page could not be found'
      )
      const res = await helpers.goto(path)
      expect(res.status()).toBe(404)
      expect(await page.title()).toBe('404 Not found · innoDoc')
    })
  })

  it('should render 404 client-side', async () => {
    await helpers.goto('section/02-elements/04-links/01-internal')
    await page.click('[href*=does-not-exist]')
    await expect(page).toHaveText('[class*=content___] .ant-result', 'This page could not be found')
    expect(await page.title()).toBe('404 Not found · innoDoc')
  })
})
