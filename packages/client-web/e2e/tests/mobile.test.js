describe('Media query', () => {
  it('should toggle drawer menu', async () => {
    await jestPlaywright.resetContext({ viewport: { width: 320, height: 600 } })
    await helpers.goto()
    expect(await page.$('.ant-drawer')).toBeNull()
    await page.click('[class*=mobileMenuButton___]')
    expect(page).toHaveText('.ant-drawer', 'Menu')
    const menu = await page.$('.ant-drawer ul[class*="nav___"]')
    await expect(menu).toHaveText('About')
    await expect(menu).toHaveText('Language')
    await expect(menu).toHaveText('Login')
    await page.click('button.ant-drawer-close')
    await page.waitForSelector('.ant-drawer', { state: 'hidden' })
  })

  describe('mobile menu button', () => {
    it('should be visible on small viewport', async () => {
      await jestPlaywright.resetContext({ viewport: { width: 320, height: 600 } })
      await helpers.goto()
      await page.waitForSelector('[class*=mobileMenuButton___]')
    })

    it('should be hidden on wide viewport', async () => {
      await jestPlaywright.resetContext({ viewport: { width: 800, height: 600 } })
      await helpers.goto()
      await page.waitForSelector('[class*=mobileMenuButton___]', { state: 'hidden' })
    })
  })
})

describe('Mobile display', () => {
  it('should support very low browser resolution', async () => {
    await jestPlaywright.resetContext({ viewport: { width: 280, height: 600 } })
    await helpers.goto()
    const contentWidth = await page.$eval('[class*=content___]', (el) => el.clientWidth)
    expect(contentWidth).toBe(280)
  })
})
