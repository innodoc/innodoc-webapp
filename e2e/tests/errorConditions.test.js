describe.each(['/path-does-not-exist', '/page', '/page/', '/page/does-not-exist'])(
  'should receive "404" from server', (path) => {
    test(path, async () => {
      expect.assertions(1)
      const resp = await page.goto(getUrl(path))
      expect(resp.status()).toBe(404)
    })
  }
)

it('should render "404" client-side', async () => {
  expect.assertions(2)
  await page.goto(getUrl('/page/02-elements/03-links-and-formatting'))
  await page.screenshot({ path: 'out.png', fullPage: true })
  await expect(page).toClick('[href*=does-not-exist]')
  await expect(page).toMatchElement('.ant-alert', { text: '404' })
})
