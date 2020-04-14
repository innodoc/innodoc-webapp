const { existsSync } = require('fs')

const NodeEnvironment = require('jest-environment-node')
const Wendigo = require('wendigo')

const escapeXPathString = (str) => {
  const splitedQuotes = str.replace(/'/g, `', "'", '`)
  return `concat('${splitedQuotes}', '')`
}

class WendigoEnvironment extends NodeEnvironment {
  async setup() {
    // Browser launch options
    const headless = process.env.PUPPETEER_HEADLESS !== 'false'
    const launchOpts = {
      defaultTimeout: 2000,
      headless,
      incognito: true,
      slowMo: headless ? 0 : 50,
    }
    if (existsSync('/etc/alpine-release')) {
      // only for CI
      launchOpts.args = ['--no-sandbox', '--disable-dev-shm-usage']
      launchOpts.defaultTimeout = 5000
      launchOpts.executablePath = '/usr/bin/chromium-browser'
    }

    // Provide globals
    this.global.getUrl = (rest = '') => `${process.env.APP_ROOT}${rest}`
    this.global.openUrl = async (urlFragment, opts) => {
      await this.global.browser.open(this.global.getUrl(urlFragment), {
        headers: { 'Accept-Language': 'en-US' },
        viewport: { width: 1200, height: 600 },
        ...opts,
      })
      await this.global.browser.waitFor(
        '//div[contains(@class, "header")]/./span[text()[contains(.,"innoDoc")]]'
      )
      await this.global.browser.waitFor(
        '//div[contains(@class, "content___")]/*'
      )
      await this.global.browser.waitFor(
        '//footer[contains(@class, "footer___")]/*'
      )
    }
    this.global.hoverNavItem = async (text) => {
      const escaped = escapeXPathString(text)
      await this.global.browser.page.mouse.move(0, 0)
      await this.global.browser.hover(
        `//ul[contains(@class,"nav___")]/li//*[text()[contains(.,${escaped})]]`
      )
      await this.global.browser.waitFor(200)
    }
    this.global.resetBrowser = async () => {
      if (this.global.browser) {
        await this.global.browser.close()
      }
      this.global.browser = await Wendigo.createBrowser(launchOpts)
    }

    // Launch browser
    await this.global.resetBrowser()
  }

  async teardown() {
    if (this.global.browser) {
      await this.global.browser.close()
    }
    await Wendigo.stop()
  }
}

module.exports = WendigoEnvironment
