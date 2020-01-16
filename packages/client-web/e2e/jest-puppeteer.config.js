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
const rootPath = path.resolve(__dirname, '..', '..')
const serverCmd = `cd ${rootPath} && ${serverEnvVars} yarn start`
const testCmd = `cd ${__dirname} && yarn run test:e2e:content`

const server = [
  {
    command: serverCmd,
    port: parseInt(process.env.PROD_PORT, 10),
    launchTimeout,
    protocol,
    usedPortAction,
  },
  {
    command: testCmd,
    port: parseInt(process.env.CONTENT_PORT, 10),
    launchTimeout,
    protocol,
    usedPortAction,
  },
]

module.exports = { launch, server }
