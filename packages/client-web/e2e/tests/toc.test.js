const waitForSiderWidth = async (width) => {
  await browser.waitFor(
    (w) => {
      const node = document.querySelector('.ant-layout-sider')
      if (node) {
        const styleW = node.style.width
        return parseInt(styleW.slice(0, -2), 10) === w
      }
      return false
    },
    DEFAULT_TIMEOUT,
    width
  )
}
const waitForSiderClosed = () => waitForSiderWidth(0)
const waitForSiderOpen = () => waitForSiderWidth(400)

const waitForHeader = (text) =>
  browser.waitFor(
    (t) => {
      const node = document.querySelector('[class*=content___] h1')
      if (node) {
        return node.innerText === t
      }
      return false
    },
    DEFAULT_TIMEOUT,
    text
  )

const expectSwitcherAmount = async (n, type = '') =>
  expect(
    await browser.queryAll(`.ant-layout-sider .ant-tree-switcher${type}`)
  ).toHaveLength(n)

beforeEach(resetBrowser)

describe('TOC', () => {
  it('should have working section link', async () => {
    await openUrl()
    await browser.waitAndClick(
      '[class*=content___] button[title="Show table of contents"]'
    )
    await waitForSiderOpen()
    await browser.assert.textContains('.ant-layout-sider', [
      '1 Project structure',
      '2 Content elements',
    ])
    await browser.wait(100) // no idea why this is needed... :|
    await browser.waitAndClick(
      '.ant-layout-sider a[href="/section/01-project"]'
    )
    await browser.waitForNavigation()
    await waitForHeader('1 Project structure')
  })

  it('should have collapsible nodes', async () => {
    await openUrl('section/01-project')
    await browser.waitAndClick(
      '[class*=content___] button[title="Show table of contents"]'
    )
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

    await expectSwitcherAmount(6)
    await expectSwitcherAmount(1, '_open')
    await expectSwitcherAmount(2, '_close')

    await browser.wait(500)
    await browser.clickText('.ant-layout-sider', '1.2 Files')
    await browser.waitForNavigation()

    await browser.wait(500)
    await expectSwitcherAmount(8)
    await expectSwitcherAmount(2, '_open')
    await expectSwitcherAmount(1, '_close')

    await browser.assert.textContains('.ant-layout-sider', [
      '1.2.1 manifest.yml',
      '1.2.2 Content files',
    ])
  })

  it('should respond to section change', async () => {
    await openUrl('section/01-project/04-building')
    await browser.waitAndClick(
      '[class*=content___] button[title="Show table of contents"]'
    )
    await waitForSiderOpen()
    await expectSwitcherAmount(6)
    await browser.waitAndClick(
      '[class*=sectionAffix___] button[title="2 Content elements"]'
    )
    await waitForHeader('2 Content elements')
    await expectSwitcherAmount(17)
  })

  it('should be toggleable using content button', async () => {
    await openUrl()
    await waitForSiderClosed()
    await browser.waitAndClick(
      '[class*=content___] button[title="Show table of contents"]'
    )
    await waitForSiderOpen()
    await browser.waitAndClick(
      '[class*=content___] button[title="Close table of contents"]'
    )
    await waitForSiderClosed()
  })

  it('should be closeable using sider button', async () => {
    await openUrl()
    await waitForSiderClosed()
    await browser.waitAndClick(
      '[class*=content___] button[title="Show table of contents"]'
    )
    await waitForSiderOpen()
    await browser.waitAndClick(
      '.ant-layout-sider button[title="Close table of contents"]'
    )
    await waitForSiderClosed()
  })
})
