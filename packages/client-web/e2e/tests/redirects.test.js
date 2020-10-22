beforeEach(async () => {
  await jestPlaywright.resetContext()
})

describe('Redirects', () => {
  it('should redirect index / to homeLink', async () => {
    const res = await helpers.goto()
    await page.waitForSelector('"About this course"')
    const firstReq = res.request().redirectedFrom()
    expect(firstReq.redirectedFrom()).toBeNull()
    expect(firstReq.url()).toBe(process.env.APP_ROOT)
    expect(await page.title()).toBe('About this course · innoDoc')
  })

  it.each(['page/about/', 'login/'])('should remove trailing slash (%s)', async (path) => {
    const res = await helpers.goto(path)
    expect(res.url().endsWith(`/${path.slice(0, -1)}`)).toBe(true)
    expect(res.request().redirectedFrom()).toBeTruthy()
  })
})
