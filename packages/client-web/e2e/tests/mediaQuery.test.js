beforeEach(resetBrowser)

describe('Media query', () => {
  it('should toggle drawer menu', async () => {
    await openUrl('', { viewport: { width: 320, height: 600 } })
    await browser.assert.not.visible('.ant-drawer')
    await browser.click('[class*=mobileMenuButton]')
    await browser.wait(500)
    await browser.assert.textContains('.ant-drawer', 'Menu')
    const mobileMenu = await browser.query('.ant-drawer ul[class*="nav___"]')
    await browser.assert.textContains(mobileMenu, 'About')
    await browser.assert.textContains(mobileMenu, 'Language')
    await browser.assert.textContains(mobileMenu, 'Login')
    await browser.click('button.ant-drawer-close')
    await browser.waitFor(
      (s) => {
        const { width } = window.getComputedStyle(document.querySelector(s))
        return width === '0px'
      },
      DEFAULT_TIMEOUT,
      '.ant-drawer'
    )
  })

  describe('mobile menu button', () => {
    it('should show on small viewport', async () => {
      await openUrl('', { viewport: { width: 320, height: 600 } })
      await browser.assert.visible('[class*=mobileMenuButton]')
    })

    it('should hide on wide viewport', async () => {
      await openUrl('', { viewport: { width: 800, height: 600 } })
      await browser.assert.not.visible('[class*=mobileMenuButton]')
    })
  })
})
