const fs = require('fs')

// chromium launch options
const headless = process.env.PUPPETEER_HEADLESS !== 'false'
const launch = {
  headless,
  slowMo: headless ? 0 : 250,
}
if (fs.existsSync('/etc/alpine-release')) {
  // only for CI
  launch.executablePath = '/usr/bin/chromium-browser'
  launch.args = ['--no-sandbox', '--disable-dev-shm-usage']
}

// setup application and content server
const launchTimeout = 60000
const protocol = 'http'
const usedPortAction = 'error'
const server = [
  {
    command: `PROD_PORT=${process.env.PROD_PORT} yarn run start`,
    port: parseInt(process.env.PROD_PORT, 10),
    launchTimeout,
    protocol,
    usedPortAction,
  },
  {
    command: `CONTENT_PORT=${process.env.CONTENT_PORT} yarn run test:e2e:content`,
    port: parseInt(process.env.CONTENT_PORT, 10),
    launchTimeout,
    protocol,
    usedPortAction,
  },
]

module.exports = { launch, server }
