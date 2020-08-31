const { resolve } = require('path')
const { setup: setupServer } = require('jest-process-manager')

const rootPath = resolve(__dirname, '..', '..', '..', '..')
const clientWebPath = resolve(rootPath, 'packages', 'client-web')
const isCI = process.env.INNODOC_WEBAPP_CI === 'true'
const usedPortAction = 'error'
const launchTimeout = 60000
const appPort = 6123

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

const servers = [
  {
    command: serverCmd,
    debug: true,
    launchTimeout,
    port: appPort,
    protocol: 'http',
    usedPortAction,
  },
  {
    command: contentCmd,
    launchTimeout,
    port: contentPort,
    protocol: 'http',
    usedPortAction,
  },
]

// in-memory mongodb (CI has a companion mongodb container)
if (!isCI) {
  const startMongodScript = resolve(__dirname, 'startMongod.js')
  const mongoUrl = process.env.MONGO_URL
  const mongoUrlObj = new URL(mongoUrl)
  const mongoPort = mongoUrlObj.port.length ? parseInt(mongoUrlObj.port, 10) : 27017
  servers.push({
    command: `node ${startMongodScript} ${mongoUrl}`,
    launchTimeout,
    port: mongoPort,
    protocol: 'tcp',
    usedPortAction,
  })
}

module.exports = async () => {
  await setupServer(servers)
  console.log('Dev servers started') // eslint-disable-line no-console
}
