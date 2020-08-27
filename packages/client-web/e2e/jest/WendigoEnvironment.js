const { existsSync } = require('fs')

const NodeEnvironment = require('jest-environment-node')
const Wendigo = require('wendigo')
const testHelpers = require('./testHelpers')

const isCI = existsSync('/etc/alpine-release')
const userAgent =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36'

class WendigoEnvironment extends NodeEnvironment {
  async setup() {
    const defaultTimeout = isCI ? 30000 : 10000

    // Browser launch options
    const headless = process.env.PUPPETEER_HEADLESS !== 'false'
    this.wenidgoOpts = {
      defaultTimeout,
      incognito: true,
      userAgent,
    }
    if (isCI) {
      this.wenidgoOpts.args = ['--no-sandbox', '--disable-dev-shm-usage']
      this.wenidgoOpts.executablePath = '/usr/bin/chromium-browser'
    }
    if (!headless) {
      this.wenidgoOpts.headless = false
      this.wenidgoOpts.slowMo = 50
    }

    // Provide globals
    this.global.DEFAULT_TIMEOUT = defaultTimeout
    testHelpers(this)

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
