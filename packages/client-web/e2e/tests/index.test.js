beforeEach(resetBrowser)

describe('Index', () => {
  it('redirects to homeLink', async () => {
    await openUrl()
    const [req] = await browser.requests.all()
    const chain = req.redirectChain()
    expect(chain).toHaveLength(1)
    const redirectResponse = await chain[0].response()
    expect(redirectResponse.status()).toBe(301)
    expect(redirectResponse.headers().location).toBe('/page/about')
    expect(await browser.text('h1')).toContain('About this course')
    expect(await browser.title()).toBe('About this course · innoDoc')
  })
})
