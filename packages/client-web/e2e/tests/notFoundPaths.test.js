beforeEach(resetBrowser)

describe.each([
  'path-does-not-exist',
  'page',
  'page/does-not-exist',
  'section',
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
    expect(await browser.title()).toBe('404 Not found · innoDoc')
  })
})

describe.each(['page/', 'section/'])('should receive "308" from server', (path) => {
  test(path, async () => {
    await openUrl(path)
    const [req] = await browser.requests.all()
    expect(req.response().status()).toBe(308)
    const chain = req.redirectChain()
    expect(chain).toHaveLength(1)
    const redirectResponse = await chain[0].response()
    expect(redirectResponse.headers().location).toBe(`/${path.slice(0, -1)}`)
    await browser.assert.requests.status(404)
    await browser.assert.textContains(
      '[class*=content___] .ant-result',
      'This page could not be found'
    )
    expect(await browser.title()).toBe('404 Not found · innoDoc')
  })
})

it('should render "404" client-side', async () => {
  await openUrl('section/02-elements/04-links/01-internal')
  await browser.click('[href*=does-not-exist]')
  await browser.wait(100)
  await browser.waitFor('[class*=content___] .ant-result')
  await browser.assert.textContains(
    '[class*=content___] .ant-result',
    'This page could not be found'
  )
  expect(await browser.title()).toBe('404 Not found · innoDoc')
})
