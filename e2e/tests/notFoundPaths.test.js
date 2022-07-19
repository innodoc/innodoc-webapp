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
      const res = await helpers.goto(path)
      await page.waitForSelector('"404 Not found"')
      expect(res.status()).toBe(404)
      expect(await page.title()).toBe('404 Not found · innoDoc')
    })
  })

  it('should render 404 client-side', async () => {
    await helpers.goto('section/02-elements/02-links/01-internal')
    await page.click('[href*=does-not-exist]')
    await page.waitForSelector('"404 Not found"')
    expect(await page.title()).toBe('404 Not found · innoDoc')
  })
})
