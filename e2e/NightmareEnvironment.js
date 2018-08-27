/* eslint-disable no-console */

const NodeEnvironment = require('jest-environment-node')
const nightmare = require('nightmare')
const url = require('url')
const waitPort = require('wait-port')
const { spawn } = require('child_process')
const path = require('path')

const TEST_PORT = 7000
const CONTENT_PORT = 7001
const WAIT_PORT_OPTS = { timeout: 3000, output: 'silent' }
const SPAWN_OPTS = { cwd: path.join(__dirname, '..'), detached: true }

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

const printProcessOutput = prefix => (
  process.env.DEBUG
    ? (data) => { console.log(`${prefix}: ${data.toString()}`) }
    : () => {}
)

class NightmareEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup()

    // spawn app server

    this.serverProcess = spawn('npm', ['run', 'start'], {
      ...SPAWN_OPTS,
      env: { PROD_PORT: TEST_PORT },
    })
    this.serverProcess.on('error', handleError)
    this.serverProcess.stdout.on('data', printProcessOutput('Server STDOUT'))
    this.serverProcess.stderr.on('data', (data) => {
      throw new Error(`FATAL: Server is printing to STDERR: ${data.toString()}`)
    })

    if (!await waitPort({ ...WAIT_PORT_OPTS, port: TEST_PORT })) {
      throw new Error("Server didn't come up!")
    }

    // spawn content server

    // if (!await waitPort({ ...WAIT_PORT_OPTS, port: CONTENT_PORT })) {
    //   throw new Error('Content server timeout…')
    // }

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
    await super.teardown()
  }

  runScript(script) {
    return super.runScript(script)
  }
}

module.exports = NightmareEnvironment
