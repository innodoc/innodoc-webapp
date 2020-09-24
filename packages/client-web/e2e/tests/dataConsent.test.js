beforeEach(async () => {
  await jestPlaywright.resetContext()
})

describe('Data consent', () => {
  it('should not be possible to skip w/o accepting', async () => {
    await helpers.goto('section/01-project', false)
    const modal = await page.waitForSelector('.ant-modal')
    await expect(modal).toHaveText('Cookies and data protection')
    const okButton = await modal.waitForSelector('*css=button >> "OK"')
    expect(await okButton.getAttribute('disabled')).not.toBeNull()
  })

  it('should set cookie and close modal when accepting', async () => {
    await helpers.goto('section/01-project', false)
    const modal = await page.waitForSelector('.ant-modal')
    const switches = await modal.$$('button[role=switch]')
    await Promise.all(switches.map((sw) => sw.click()))
    const okButton = await modal.waitForSelector('*css=button >> "OKK"')
    await okButton.click()
    await page.waitForSelector('.ant-modal', { state: 'hidden' })
    const cookie = await helpers.getCookie('data-consent')
    expect(cookie.value).toBe('true')
  })
})
