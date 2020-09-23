beforeEach(async () => {
  await jestPlaywright.resetContext()
})

describe('Data consent', () => {
  it('should not be possible to skip w/o accepting', async () => {
    await helpers.goto('section/01-project', false)
    await page.waitForSelector('.ant-modal', '"Cookies and data protection"')
    await page.click('.ant-modal >> "OK"', { force: true })
    await page.waitForTimeout(100)
    await page.waitForSelector('.ant-modal', '"Cookies and data protection"')
  })

  it('should set cookie and close modal when accepting', async () => {
    await helpers.goto('section/01-project', false)
    await page.waitForSelector('.ant-modal', '"Cookies and data protection"')
    const switches = await page.$$('.ant-modal button[role=switch]')
    await Promise.all(switches.map((sw) => sw.click()))
    await page.click('.ant-modal >> "OK"')
    await page.waitForSelector('.ant-modal', { state: 'hidden' })
    const cookie = await helpers.getCookie('data-consent')
    expect(cookie.value).toBe('true')
  })
})
