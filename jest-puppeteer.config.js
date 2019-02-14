const fs = require('fs')

const headless = process.env.PUPPETEER_HEADLESS !== 'true'
const launchTimeout = 60000
const protocol = 'http'
const usedPortAction = 'error'
const launch = {
  headless,
  slowMo: headless ? 0 : 250,
}

// detect alpine/CI
if (fs.existsSync('/etc/alpine-release')) {
  launch.args = ['--no-sandbox', '--disable-dev-shm-usage']
  launch.executablePath = '/usr/bin/chromium-browser'
}

const server = [
  {
    command: `PROD_PORT=${process.env.PROD_PORT} npm run start`,
    port: parseInt(process.env.PROD_PORT, 10),
    launchTimeout,
    protocol,
    usedPortAction,
  },
  {
    command: `CONTENT_PORT=${process.env.CONTENT_PORT} npm run test:e2e:content`,
    port: parseInt(process.env.CONTENT_PORT, 10),
    launchTimeout,
    protocol,
    usedPortAction,
  },
]

module.exports = { launch, server }
