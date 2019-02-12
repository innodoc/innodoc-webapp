const headless = process.env.PUPPETEER_HEADLESS !== 'true'
const launchTimeout = 15000
const protocol = 'http'
const usedPortAction = 'error'

module.exports = {
  launch: {
    headless,
    slowMo: headless ? 0 : 250,
  },
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
