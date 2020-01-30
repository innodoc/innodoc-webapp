describe('Media query', () => {
  beforeEach(async () => {
    await page.goto(getUrl())
    await page.setViewport({ width: 400, height: 600 })
  })

  it('should toggle drawer menu', async () => {
    expect.assertions(5)
    await expect(page).not.toMatchElement('.ant-drawer')
    await expect(page).toClick('[class*=mobileMenuButton]')
    const drawer = await expect(page).toMatchElement('.ant-drawer', {
      visible: true,
    })
    await page.waitFor(500) // animation?
    await expect(drawer).toClick('.ant-drawer-close')
    await page.waitFor(500)
    expect(
      await page.$eval(
        '.ant-drawer',
        (elem) => window.getComputedStyle(elem).width
      )
    ).toBe('0px')
  })

  describe('mobile menu button', () => {
    it('should show on small viewport', async () => {
      expect.assertions(1)
      await expect(page).toMatchElement('[class*=mobileMenuButton]', {
        visible: true,
      })
    })

    it('should hide on wide viewport', async () => {
      expect.assertions(1)
      await page.setViewport({ width: 800, height: 600 })
      const val = await page.$eval(
        '[class*=mobileMenuButton]',
        (elem) => window.getComputedStyle(elem).display
      )
      expect(val).toBe('none')
    })
  })
})
