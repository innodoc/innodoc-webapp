const fs = require('fs')
const { resolve } = require('path')

const NodeEnvironment = require('jest-environment-node')
const Wendigo = require('wendigo')
const {
  setup: setupServer,
  teardown: teardownServer,
} = require('jest-dev-server')

const rootPath = resolve(__dirname, '..', '..', '..', '..')
const clientWebPath = resolve(rootPath, 'packages', 'client-web')
const usedPortAction = 'kill'
const launchTimeout = 60000

const escapeXPathString = (str) => {
  const splitedQuotes = str.replace(/'/g, `', "'", '`)
  return `concat('${splitedQuotes}', '')`
}

// application server
const serverEnvVars = [
  // force configuration in case .env is customized
  'PAGE_PATH_PREFIX=page',
  'SECTION_PATH_PREFIX=section',
  'SMTP_SKIP_MAILS=yes',
].join(' ')
const serverCmd = `cd ${rootPath} && ${serverEnvVars} yarn start`

// content server
const contentPort = parseInt(new URL(process.env.CONTENT_ROOT).port, 10)
const contentCmd = `cd ${clientWebPath} && CONTENT_PORT=${contentPort} yarn run test:e2e:content`

// in-memory mongodb
const startMongodScript = resolve(__dirname, 'startMongod.js')
const mongoUrl = process.env.MONGO_URL
const mongoCmd = `node ${startMongodScript} ${mongoUrl}`

const server = [
  {
    command: serverCmd,
    launchTimeout,
    port: parseInt(new URL(process.env.APP_ROOT).port, 10),
    protocol: 'http',
    usedPortAction,
  },
  {
    command: contentCmd,
    launchTimeout,
    port: contentPort,
    protocol: 'http',
    usedPortAction,
  },
]

class WendigoEnvironment extends NodeEnvironment {
  async setup() {
    // Browser launch options
    const headless = process.env.PUPPETEER_HEADLESS !== 'false'
    const launchOpts = {
      headless,
      incognito: true,
      slowMo: headless ? 0 : 50,
    }
    if (fs.existsSync('/etc/alpine-release')) {
      // only for CI
      launchOpts.executablePath = '/usr/bin/chromium-browser'
      launchOpts.args = ['--no-sandbox', '--disable-dev-shm-usage']
    } else {
      server.push({
        command: mongoCmd,
        launchTimeout,
        port: parseInt(mongoUrl, 10),
        protocol: 'tcp',
        usedPortAction,
      })
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

    // Spawn required servers
    await setupServer(server)

    // Launch browser
    await this.global.resetBrowser()
  }

  async teardown() {
    if (this.global.browser) {
      await this.global.browser.close()
    }
    await Wendigo.stop()
    await teardownServer()
  }
}

module.exports = WendigoEnvironment
