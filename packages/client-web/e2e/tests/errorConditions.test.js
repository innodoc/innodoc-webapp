describe.each([
  '/path-does-not-exist',
  '/page',
  '/page/',
  '/page/does-not-exist',
  '/section',
  '/section/',
  '/section/does-not-exist',
])(
  'should receive "404" from server', (path) => {
    test(path, async () => {
      expect.assertions(2)
      const resp = await page.goto(getUrl(path))
      expect(resp.status()).toBe(404)
      await expect(page).toMatch('This page could not be found')
    })
  }
)

it('should render "404" client-side', async () => {
  expect.assertions(2)
  await page.goto(getUrl('/section/02-elements/04-links/01-internal'))
  await expect(page).toClick('[href*=does-not-exist]')
  await expect(page).toMatch('This page could not be found')
})