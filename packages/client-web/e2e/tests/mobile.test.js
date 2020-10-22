const desktop = { width: 800, height: 600 }
const mobile = { width: 320, height: 600 }

beforeAll(async () => {
  await jestPlaywright.resetContext({ viewport: mobile })
  await helpers.goto()
})

describe('Media query', () => {
  it('should toggle drawer menu', async () => {
    await page.setViewportSize(mobile)
    expect(await page.$('.ant-drawer')).toBeNull()
    await page.click('header >> [title="Menu"]')
    const drawer = await page.waitForSelector('.ant-drawer')
    await expect(drawer).toHaveText('Menu')
    await expect(drawer).toHaveText('About')
    await expect(drawer).toHaveText('Progress')
    await expect(drawer).toHaveText('PDF')
    await expect(drawer).toHaveText('Language')
    await expect(drawer).toHaveText('Account')
    const closeBtn = await drawer.$('[aria-label="Close"]')
    await closeBtn.click()
    await page.waitForSelector('.ant-drawer', { state: 'hidden' })
  })

  describe('Mobile menu button', () => {
    it('should be visible on small viewport', async () => {
      await page.setViewportSize(mobile)
      await page.waitForSelector('header >> [title="Menu"]')
    })

    it('should be hidden on wide viewport', async () => {
      await page.setViewportSize(desktop)
      await page.waitForSelector('header >> [title="Menu"]', { state: 'hidden' })
    })
  })
})

describe('Mobile display', () => {
  it('should support very low browser resolution', async () => {
    await page.setViewportSize(mobile)
    const contentWidth = await page.$eval('[class*=content___]', (el) => el.clientWidth)
    expect(contentWidth).toBe(320)
  })
})
