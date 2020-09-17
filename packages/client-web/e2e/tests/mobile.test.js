beforeEach(resetBrowser)

describe('Mobile display', () => {
  it('should support very low browser resolution', async () => {
    await openUrl('', { viewport: { width: 280, height: 653 } })
    const contentWidth = await browser.evaluate(
      () => document.querySelector('[class*=content___]').clientWidth
    )
    expect(contentWidth).toBe(280)
  })
})
