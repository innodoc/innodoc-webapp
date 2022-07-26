const { resolve } = require('path')

const rootPath = resolve(__dirname, '..', '..', '..', '..')
const clientWebPath = resolve(rootPath, 'packages', 'client-web')
const headless = process.env.PLAYWRIGHT_HEADLESS !== 'false'
const isCI = process.env.INNODOC_WEBAPP_CI === 'true'
const launchTimeout = 60000
const usedPortAction = 'error'
const appPort = 6123
const contentPort = parseInt(new URL(process.env.CONTENT_ROOT).port, 10)

// Force configuration in case .env is customized
const serverEnvVars = [
  `APP_ROOT=http://localhost:${appPort}/`,
  `APP_PORT=${appPort}`,
  'LOG_ERROR_EMAIL=admin@example.com',
  'LOG_FILE=',
  'JWT_SECRET=jwtsecret123',
  'NEXT_PUBLIC_PAGE_PATH_PREFIX=page',
  'NEXT_PUBLIC_SECTION_PATH_PREFIX=section',
  'SMTP_SKIP_MAILS=yes',
].join(' ')

const serverOptions = [
  {
    command: `cd ${rootPath} && ${serverEnvVars} yarn start`,
    debug: true,
    launchTimeout,
    port: appPort,
    protocol: 'http',
    usedPortAction,
  },
  {
    command: `cd ${clientWebPath} && CONTENT_PORT=${contentPort} yarn run test:e2e:content`,
    launchTimeout,
    port: contentPort,
    protocol: 'http',
    usedPortAction,
  },
]

if (!isCI) {
  // in-memory mongodb (CI has a companion mongodb container)
  const startMongodScript = resolve(__dirname, 'startMongod.js')
  const mongoUrl = process.env.MONGO_URL
  const mongoUrlObj = new URL(mongoUrl)
  serverOptions.push({
    command: `yarn node ${startMongodScript} ${mongoUrl}`,
    launchTimeout,
    port: mongoUrlObj.port.length ? parseInt(mongoUrlObj.port, 10) : 27017,
    protocol: 'tcp',
    usedPortAction,
  })
}

module.exports = {
  contextOptions: {
    extraHTTPHeaders: { 'Accept-Language': 'en-US' },
    viewport: { width: 1200, height: 600 },
  },
  launchOptions: {
    headless,
    slowMo: headless ? 0 : 50,
  },
  serverOptions,
}
