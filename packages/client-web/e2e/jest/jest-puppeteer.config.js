const fs = require('fs')
const { resolve } = require('path')

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

const rootPath = resolve(__dirname, '..', '..', '..', '..')
const clientWebPath = resolve(rootPath, 'packages', 'client-web')
const usedPortAction = 'kill'
const launchTimeout = 60000

// in-memory mongodb
const startMongodScript = resolve(__dirname, 'startMongod.js')
const mongoUrl = process.env.MONGO_URL
const mongoCmd = `node ${startMongodScript} ${mongoUrl}`

// setup application and content server
const serverEnvVars = [
  // force configuration in case .env is customized
  'SECTION_PATH_PREFIX=section',
  'PAGE_PATH_PREFIX=page',
].join(' ')
const serverCmd = `cd ${rootPath} && ${serverEnvVars} yarn start`
const contentPort = parseInt(new URL(process.env.CONTENT_ROOT).port, 10)
const testCmd = `cd ${clientWebPath} && CONTENT_PORT=${contentPort} yarn run test:e2e:content`

const server = [
  {
    command: mongoCmd,
    launchTimeout,
    port: parseInt(mongoUrl, 10),
    protocol: 'tcp',
    usedPortAction,
  },
  {
    command: serverCmd,
    launchTimeout,
    port: parseInt(new URL(process.env.APP_ROOT).port, 10),
    protocol: 'http',
    usedPortAction,
  },
  {
    command: testCmd,
    launchTimeout,
    port: contentPort,
    protocol: 'http',
    usedPortAction,
  },
]

module.exports = { launch, server }
