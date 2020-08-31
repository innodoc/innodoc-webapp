const { resolve } = require('path')
const { setup: setupServer } = require('jest-dev-server')

const rootPath = resolve(__dirname, '..', '..', '..', '..')
const clientWebPath = resolve(rootPath, 'packages', 'client-web')
const isCI = process.env.INNODOC_WEBAPP_CI === 'true'
const usedPortAction = 'error'
const launchTimeout = 60000

// application server
const serverEnvVars = [
  // force configuration in case .env is customized
  'APP_ROOT=http://localhost:6123/',
  'APP_PORT=6123',
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

// in-memory mongodb
const startMongodScript = resolve(__dirname, 'startMongod.js')
const mongoUrl = process.env.MONGO_URL
const mongoCmd = `node ${startMongodScript} ${mongoUrl}`

const servers = [
  {
    command: serverCmd,
    debug: true,
    launchTimeout,
    port: parseInt(process.env.APP_PORT, 10),
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

if (!isCI) {
  servers.push({
    command: mongoCmd,
    launchTimeout,
    port: parseInt(mongoUrl, 10),
    protocol: 'tcp',
    usedPortAction,
  })
}

module.exports = () => setupServer(servers)
