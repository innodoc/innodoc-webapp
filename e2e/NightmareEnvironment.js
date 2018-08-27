const NodeEnvironment = require('jest-environment-node')
const nightmare = require('nightmare')
const url = require('url')
const waitOn = require('wait-on')

const BASE_URL = url.format({
  protocol: 'http',
  hostname: 'localhost',
  port: 7000,
})

const BASE_CONTENT_URL = url.format({
  protocol: 'http',
  hostname: 'localhost',
  port: 7001,
})

class NightmareEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup()

    waitOn({
      resources: [BASE_URL, BASE_CONTENT_URL],
      timeout: 30000,
    }, (err) => {
      if (err) {
        throw err
      }

    })

    this.global.visit = (path) => {
      const location = url.resolve(BASE_URL, path)
      this.browser = nightmare({
        show: process.env.DEBUG || false,
        pollInterval: 50,
        gotoTimeout: 10000,
        loadTimeout: 15000,
        waitTimeout: 15000,
      })
      return this.browser.goto(location)
    }
  }

  async teardown() {
    this.browser.end().then(() => {
      console.log('Nightmare test browser was killed.')
    })
    await super.teardown()
  }

  runScript(script) {
    return super.runScript(script)
  }
}

module.exports = NightmareEnvironment
