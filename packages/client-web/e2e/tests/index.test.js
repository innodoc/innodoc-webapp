describe('Index', () => {
  it('redirects to homeLink', async () => {
    expect.assertions(4)
    const response = await page.goto(getUrl())
    const chain = response.request().redirectChain()
    expect(chain).toHaveLength(1)
    const redirectResponse = await chain[0].response()
    expect(redirectResponse.status()).toBe(301)
    expect(redirectResponse.headers().location).toBe('/page/about')
    await expect(page).toMatchElement('h1', { text: 'About this course' })
  })
})
