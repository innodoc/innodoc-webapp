const { existsSync } = require('fs')

const NodeEnvironment = require('jest-environment-node')
const Wendigo = require('wendigo')

const escapeXPathString = (str) => {
  const splitedQuotes = str.replace(/'/g, `', "'", '`)
  return `concat('${splitedQuotes}', '')`
}

const isCI = existsSync('/etc/alpine-release')

class WendigoEnvironment extends NodeEnvironment {
  async setup() {
    const defaultTimeout = isCI ? 30000 : 10000

    // Browser launch options
    const headless = process.env.PUPPETEER_HEADLESS !== 'false'
    const wendigoOpts = {
      defaultTimeout,
      incognito: true,
      userAgent:
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36',
    }
    if (isCI) {
      wendigoOpts.args = ['--no-sandbox', '--disable-dev-shm-usage']
      wendigoOpts.executablePath = '/usr/bin/chromium-browser'
    }
    if (!headless) {
      wendigoOpts.headless = false
      wendigoOpts.slowMo = 50
    }

    // Provide globals
    this.global.DEFAULT_TIMEOUT = defaultTimeout

    this.global.getUrl = (rest = '') => `${process.env.APP_ROOT}${rest}`

    this.global.openUrl = async (urlFragment, opts = {}) => {
      const mergedOpts = { skipDataConsent: true, ...opts }
      if (mergedOpts.skipDataConsent) {
        await this.global.browser.cookies.set('data-consent', {
          url: this.global.getUrl(),
          value: 'true',
        })
      }
      await this.global.browser.open(this.global.getUrl(urlFragment), {
        headers: { 'Accept-Language': 'en-US' },
        viewport: { width: 1200, height: 600 },
        ...mergedOpts,
      })
      await this.global.browser.waitFor(
        '//div[contains(@class, "header")]/./span[text()[contains(.,"innoDoc")]]'
      )
      await this.global.browser.waitFor('//div[contains(@class, "content___")]/*')
      await this.global.browser.waitFor('//footer[contains(@class, "footer___")]/*')
    }

    this.global.hoverNavItem = async (text) => {
      const escaped = escapeXPathString(text)
      await this.global.browser.page.mouse.move(0, 0)
      await this.global.browser.hover(
        `//ul[contains(@class,"nav___")]/li//*[text()[contains(.,${escaped})]]`
      )
      await this.global.browser.wait(200)
    }

    this.global.resetBrowser = async () => {
      if (this.global.browser) {
        await this.global.browser.close()
      }
      this.global.browser = await Wendigo.createBrowser(wendigoOpts)
    }

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
