/* eslint-disable no-console */

const http = require('http')
const path = require('path')
const { spawn } = require('child_process')
const url = require('url')
const NodeEnvironment = require('jest-environment-node')
const ecstatic = require('ecstatic')
const nightmare = require('nightmare')
const waitPort = require('wait-port')

const TEST_PORT = 7000
const CONTENT_PORT = 7001

const BASE_URL = url.format({
  protocol: 'http',
  hostname: 'localhost',
  port: TEST_PORT,
})

const BASE_CONTENT_URL = url.format({
  protocol: 'http',
  hostname: 'localhost',
  port: CONTENT_PORT,
})

const handleError = (err) => {
  console.log(err)
  throw err
}

class NightmareEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup()

    // spawn app server

    this.serverProcess = spawn('npm', ['run', 'start'], {
      cwd: path.join(__dirname, '..'),
      detached: true,
      env: { PROD_PORT: TEST_PORT },
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
    if (!await waitPort({ timeout: 3000, output: 'silent', port: TEST_PORT })) {
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
      })
    })

    console.log('content server listening!', this.contentServer)

    // visit function used in tests
    this.global.visit = (pathFragment) => {
      const location = url.resolve(BASE_URL, pathFragment)
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
    if (this.browser) {
      this.browser.end().then(() => {})
    }
    if (this.serverProcess.pid) {
      process.kill(-this.serverProcess.pid)
    }
    if (this.contentServer.listening) {
      this.contentServer.close()
    }
    await super.teardown()
  }

  runScript(script) {
    return super.runScript(script)
  }
}

module.exports = NightmareEnvironment
