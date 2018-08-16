const NodeEnvironment = require('jest-environment-node')
const nightmare = require('nightmare')
const url = require('url')

class NightmareEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup()

    const BASE_URL = url.format({
      protocol: 'http',
      hostname: 'localhost',
      port: 7000,
    })

    this.global.visit = (path) => {
      const location = url.resolve(BASE_URL, path)
      this.browser = nightmare({
        show: process.env.DEBUG || false,
        pollInterval: 50,
        loadTimeout: 15000,
      })
      return this.browser.goto(location)
    }
  }
}

module.exports = NightmareEnvironment
