beforeEach(resetBrowser)

describe.each([
  'path-does-not-exist',
  'page',
  'page/',
  'page/does-not-exist',
  'section',
  'section/',
  'section/does-not-exist',
])('should receive "404" from server', (path) => {
  test(path, async () => {
    await openUrl(path)
    await browser.assert.textContains(
      '[class*=content___] .ant-result',
      'This page could not be found'
    )
    const [req] = await browser.requests.all()
    expect(req.response().status()).toBe(404)
  })
})

it('should render "404" client-side', async () => {
  await openUrl('section/02-elements/04-links/01-internal')
  await browser.click('[href*=does-not-exist]')
  await browser.waitFor('[class*=content___] .ant-result')
  await browser.assert.textContains(
    '[class*=content___] .ant-result',
    'This page could not be found'
  )
})
