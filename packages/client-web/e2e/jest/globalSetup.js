const { resolve } = require('path')
const { getServers, setup: setupServer } = require('jest-process-manager')

const rootPath = resolve(__dirname, '..', '..', '..', '..')
const clientWebPath = resolve(rootPath, 'packages', 'client-web')
const isCI = process.env.INNODOC_WEBAPP_CI === 'true'
const usedPortAction = 'error'
const launchTimeout = 60000
const appPort = 6123

global.JEST_SERVERS = []

// application server
const serverEnvVars = [
  // force configuration in case .env is customized
  `APP_ROOT=http://localhost:${appPort}/`,
  `APP_PORT=${appPort}`,
  'LOG_ERROR_EMAIL=admin@example.com',
  'LOG_FILE=',
  'JWT_SECRET=jwtsecret123',
  'PAGE_PATH_PREFIX=page',
  'SECTION_PATH_PREFIX=section',
  'SMTP_SKIP_MAILS=yes',
].join(' ')
const serverCmd = `cd ${rootPath} && ${serverEnvVars} yarn start`

// content server
const contentPort = parseInt(new URL(process.env.CONTENT_ROOT).port, 10)
const contentCmd = `cd ${clientWebPath} && CONTENT_PORT=${contentPort} yarn run test:e2e:content`

const appServer = {
  command: serverCmd,
  debug: true,
  launchTimeout,
  port: appPort,
  protocol: 'http',
  usedPortAction,
}

const contentServer = [
  {
    command: contentCmd,
    launchTimeout,
    port: contentPort,
    protocol: 'http',
    usedPortAction,
  },
]

// in-memory mongodb (CI has a companion mongodb container)
const startMongodScript = resolve(__dirname, 'startMongod.js')
const mongoUrl = process.env.MONGO_URL
const mongoUrlObj = new URL(mongoUrl)
const mongoPort = mongoUrlObj.port.length ? parseInt(mongoUrlObj.port, 10) : 27017
const dbServer = {
  command: `node ${startMongodScript} ${mongoUrl}`,
  launchTimeout,
  port: mongoPort,
  protocol: 'tcp',
  usedPortAction,
}

const startServer = async (s) => {
  await setupServer(s)
  global.JEST_SERVERS.push(getServers()[0])
}

module.exports = async () => {
  await startServer(contentServer)
  if (!isCI) {
    await startServer(dbServer)
  }
  await startServer(appServer)
}
