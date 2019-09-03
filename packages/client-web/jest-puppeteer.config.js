const fs = require('fs')
const path = require('path')

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
const serverEnvVars = [
  // force configuration in case .env is customized
  'SECTION_PATH_PREFIX=section',
  'PAGE_PATH_PREFIX=page',
].join(' ')
const serverPath = path.join('..', 'server')

const server = [
  {
    command: `cd ${serverPath} && ${serverEnvVars} yarn run start`,
    port: parseInt(process.env.PROD_PORT, 10),
    launchTimeout,
    protocol,
    usedPortAction,
  },
  {
    command: 'yarn run test:e2e:content',
    port: parseInt(process.env.CONTENT_PORT, 10),
    launchTimeout,
    protocol,
    usedPortAction,
  },
]

module.exports = { launch, server }
