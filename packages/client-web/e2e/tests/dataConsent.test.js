beforeEach(resetBrowser)

describe('Data consent', () => {
  it('should not be possible to skip w/o accepting', async () => {
    await openUrl('section/01-project', { skipDataConsent: false })
    await browser.waitForText('Cookies und data protection')
    await browser.assert.visible('.ant-modal')
    await browser.clickText('OK')
    await browser.wait(500)
    await browser.assert.textContains('.ant-modal', 'Cookies und data protection')
    await browser.assert.visible('.ant-modal')
  })

  it('should set cookie and close modal when accepting', async () => {
    await openUrl('section/01-project', { skipDataConsent: false })
    await browser.waitForText('Cookies und data protection')
    await browser.assert.visible('.ant-modal')
    await browser.click('.ant-modal button[role=switch]')
    await browser.clickText('OK')
    await browser.wait(500)
    await browser.assert.not.textContains('.ant-modal', 'Cookies und data protection')
    await browser.assert.not.visible('.ant-modal')
    await browser.assert.cookies('data-consent', 'true')
  })
})
