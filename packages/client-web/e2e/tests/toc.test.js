const waitForSiderWidth = async (width) =>
  browser.waitFor(
    (w) => {
      const styleW = document.querySelector('.ant-layout-sider').style.width
      return parseInt(styleW.slice(0, -2), 10) === w
    },
    1000,
    width
  )
const waitForSiderClosed = () => waitForSiderWidth(0)
const waitForSiderOpen = () => waitForSiderWidth(300)
const waitForHeader = (text) =>
  browser.waitFor(
    (t) => document.querySelector('[class*=content___] h1').innerText === t,
    2000,
    text
  )
const expectSwitcherAmount = async (type, n) =>
  expect(
    await browser.queryAll(`.ant-layout-sider .ant-tree-switcher${type}`)
  ).toHaveLength(n)

beforeEach(resetBrowser)

describe('TOC', () => {
  it('should have TOC with working link', async () => {
    await openUrl()
    await waitForSiderClosed()
    await browser.click('[class*=content___] [class*=toggleButton]')
    await waitForSiderOpen()
    await browser.waitFor(500)
    await browser.assert.textContains('.ant-layout-sider', [
      '1 Project structure',
      '2 Content elements',
    ])
    await browser.clickText('.ant-layout-sider', '1 Project structure')
    await waitForHeader('1 Project structure')
  })

  it('should have TOC with collapsible nodes', async () => {
    await openUrl('section/01-project')
    await browser.waitFor('[class*=content___] [class*=toggleButton]')
    await browser.click('[class*=content___] [class*=toggleButton]')
    await waitForSiderOpen()

    await browser.assert.textContains('.ant-layout-sider', [
      '1 Project structure',
      '1.1 Folders',
      '1.2 Files',
      '1.3 Languages',
      '1.4 Building',
      '2 Content elements',
    ])
    await browser.assert.not.textContains('.ant-layout-sider', [
      '1.2.1 manifest.yml',
      '1.2.2 Content files',
    ])

    await expectSwitcherAmount('', 6)
    await expectSwitcherAmount('_open', 1)
    await expectSwitcherAmount('_close', 2)

    await browser.waitFor(500)
    await browser.clickText('.ant-layout-sider', '1.2 Files')
    await browser.waitFor(500)

    await expectSwitcherAmount('', 8)
    await expectSwitcherAmount('_open', 2)
    await expectSwitcherAmount('_close', 1)

    await browser.assert.textContains('.ant-layout-sider', [
      '1.2.1 manifest.yml',
      '1.2.2 Content files',
    ])
  })

  it('should have TOC nodes responding to section change', async () => {
    await openUrl('section/01-project/04-building')
    await browser.waitFor('[class*=content___] [class*=toggleButton]')
    await browser.click('[class*=content___] [class*=toggleButton]')
    await waitForSiderOpen()
    await browser.click(
      '[class*=sectionAffix___] a[title*="2 Content elements"]'
    )
    await waitForHeader('2 Content elements')
    await expectSwitcherAmount('', 16)
  })

  it('should be toggleable using content button', async () => {
    await openUrl()
    await waitForSiderClosed()
    await browser.click('[class*=content___] [class*=toggleButton]')
    await waitForSiderOpen()
    await browser.click('[class*=content___] [class*=toggleButton]')
    await waitForSiderClosed()
  })

  it('should be closeable using sider button', async () => {
    await openUrl()
    await waitForSiderClosed()
    await browser.click('[class*=content___] [class*=toggleButton]')
    await waitForSiderOpen()
    await browser.click('.ant-layout-sider [class*=closeButton] button')
    await waitForSiderClosed()
  })
})
