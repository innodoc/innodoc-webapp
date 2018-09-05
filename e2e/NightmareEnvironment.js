const path = require('path')
const url = require('url')
const Dotenv = require('dotenv-safe')
const NodeEnvironment = require('jest-environment-node')
const nightmare = require('nightmare')

const rootDir = `${__dirname}/..`
Dotenv.config({ path: path.normalize(`${rootDir}/.env`) })

const BASE_URL = url.format({
  protocol: 'http',
  hostname: 'localhost',
  port: process.env.PROD_PORT,
})

const defaultHeaders = { 'Accept-Language': 'en' }

const nightmareOptions = {
  show: process.env.NIGHTMARE_SHOW || false,
  loadTimeout: 30000,
}

// custom nightmare actions
nightmare.action('extractText', function extractText(selectorArg, done) {
  this.evaluate_now((selector) => {
    const result = document.querySelector(selector)
    return result ? result.textContent : ''
  }, done, selectorArg)
})
nightmare.action('getLangTag', function getLangTag(done) {
  this.evaluate_now(() => document.getElementsByTagName('html')[0].getAttribute('lang'), done)
})

// Jest test environment for Nightmare
class NightmareEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config)
    this.browsers = [] // remember open browser instances
  }

  async setup() {
    await super.setup()
    // visit spawns a browser and visits the given path
    this.global.visit = (pathFragment, headers = {}, cookies = null) => {
      const location = url.resolve(BASE_URL, pathFragment)
      const browser = nightmare(nightmareOptions)
      if (cookies) {
        const cookiesArray = Array.isArray(cookies) ? cookies : [cookies]
        browser.cookies.set(cookiesArray.map(cookie => ({ ...cookie, url: BASE_URL })))
      }
      this.browsers.push(browser)
      return browser.goto(location, { ...defaultHeaders, ...headers })
    }
  }

  // make sure all browser instances are stopped on exit
  async teardown() {
    await Promise.all(this.browsers.map(browser => browser.end()))
    await super.teardown()
  }

  runScript(script) {
    return super.runScript(script)
  }
}

module.exports = NightmareEnvironment
