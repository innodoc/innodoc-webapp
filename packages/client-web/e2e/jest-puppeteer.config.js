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
const contentPort = parseInt(new URL(process.env.CONTENT_ROOT).port, 10)
const testCmd = `cd ${__dirname} && CONTENT_PORT=${contentPort} yarn run test:e2e:content`

const server = [
  {
    command: serverCmd,
    launchTimeout,
    port: parseInt(new URL(process.env.APP_ROOT).port, 10),
    protocol,
    usedPortAction,
  },
  {
    command: testCmd,
    launchTimeout,
    port: contentPort,
    protocol,
    usedPortAction,
  },
]

module.exports = { launch, server }
