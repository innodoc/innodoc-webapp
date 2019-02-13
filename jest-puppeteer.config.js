const headless = process.env.PUPPETEER_HEADLESS !== 'true'
const launchTimeout = 15000
const protocol = 'http'
const usedPortAction = 'error'
const launch = {
  headless,
  slowMo: headless ? 0 : 250,
}

// TODO: detect alpine (CI)
console.log('HHIAAAAA')
console.log(`process.env.CHROME_BIN ${process.env.CHROME_BIN}`)
console.log(`process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD ${process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD}`)
launch.args = ['--no-sandbox', '--disable-dev-shm-usage']
launch.executablePath = '/usr/bin/chromium-browser'

module.exports = {
  launch,
  server: [
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
  ],
}
