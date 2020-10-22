beforeEach(async () => {
  await jestPlaywright.resetContext()
  await helpers.goto('', false)
})

describe('Data consent', () => {
  it('should not be possible to skip w/o accepting', async () => {
    const modal = await page.waitForSelector('.ant-modal')
    await expect(modal).toHaveText('Cookies and data protection')
    const okBtn = await modal.$('*css=button >> "OK"')
    expect(await okBtn.getAttribute('disabled')).not.toBeNull()
  })

  it('should set cookie and close modal when accepting', async () => {
    const modal = await page.waitForSelector('.ant-modal')
    const switches = await modal.$$('button[role=switch]')
    await Promise.all(switches.map((sw) => sw.click()))
    const okBtn = await modal.$('"OK"')
    await okBtn.click()
    await page.waitForSelector('.ant-modal', { state: 'hidden' })
    const cookie = await helpers.getCookie('data-consent')
    expect(cookie.value).toBe('true')
  })
})
