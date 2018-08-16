/* eslint-disable no-console */

const http = require('http')
const path = require('path')
const { spawn } = require('child_process')
const url = require('url')
const NodeEnvironment = require('jest-environment-node')
const ecstatic = require('ecstatic')
const nightmare = require('nightmare')
const waitPort = require('wait-port')

const PROD_PORT = 7000
const CONTENT_PORT = 7001

const BASE_URL = url.format({
  protocol: 'http',
  hostname: 'localhost',
  port: PROD_PORT,
})

const CONTENT_ROOT = url.format({
  protocol: 'http',
  hostname: 'localhost',
  port: CONTENT_PORT,
})

const handleError = (err) => {
  console.log(err)
  throw err
}

const defaultHeaders = { 'Accept-Language': 'en' }

const nightmareOptions = {
  show: process.env.NIGHTMARE_SHOW || false,
  gotoTimeout: 2000,
  loadTimeout: 2000,
  waitTimeout: 2000,
  executionTimeout: 2000,
}

// Nightmare actions
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
  async setup() {
    await super.setup()

    // spawn app server
    this.serverProcess = spawn('npm', ['run', 'start'], {
      cwd: path.join(__dirname, '..'),
      detached: true,
      env: { PROD_PORT, CONTENT_ROOT },
    })
    this.serverProcess.on('error', handleError)
    this.serverProcess.stdout.on('data', (data) => {
      if (process.env.DEBUG) {
        console.log(`'Server STDOUT': ${data.toString()}`)
      }
    })
    this.serverProcess.stderr.on('data', (data) => {
      throw new Error(`FATAL: Server is printing to STDERR: ${data.toString()}`)
    })
    if (!await waitPort({ timeout: 3000, output: 'silent', port: PROD_PORT })) {
      throw new Error("Server didn't come up!")
    }

    // spawn content server
    await new Promise((resolve, reject) => {
      this.contentServer = http.createServer(ecstatic({
        root: path.join(__dirname, 'content'),
        cors: true,
      })).listen(CONTENT_PORT, (err) => {
        if (err) {
          reject(err)
        }
        resolve()
        if (process.env.DEBUG) {
          console.log(`Started content server on port ${CONTENT_PORT}`)
        }
      })
    })

    this.browsers = []
    // expose visit function to tests
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

  async teardown() {
    // stop app server process group
    if (this.serverProcess.pid) {
      process.kill(-this.serverProcess.pid)
    }
    // stop content server
    if (this.contentServer.listening) {
      this.contentServer.close()
    }
    // make sure all browser instances are stopped
    await Promise.all(this.browsers.map(browser => browser.end()))
    await super.teardown()
  }

  runScript(script) {
    return super.runScript(script)
  }
}

module.exports = NightmareEnvironment
