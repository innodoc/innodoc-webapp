beforeEach(async () => {
  await jestPlaywright.resetContext()
})

describe('Redirects', () => {
  it('should redirect index / to homeLink', async () => {
    const res = await helpers.goto()
    await page.waitForSelector('h1', '"About this course"')
    const firstReq = res.request().redirectedFrom()
    expect(firstReq.redirectedFrom()).toBeNull()
    expect(firstReq.url()).toBe(process.env.APP_ROOT)
    expect(await page.title()).toBe('About this course · innoDoc')
  })

  it.each(['page/', 'section/'])('should remove trailing slash (%s)', (path, done) => {
    helpers.goto(path).then((res) => {
      expect(res.url().endsWith(`/${path.slice(0, -1)}`)).toBe(true)
      expect(res.request().redirectedFrom()).toBeTruthy()
      done()
    })
  })
})
