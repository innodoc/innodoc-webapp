const headless = process.env.PLAYWRIGHT_HEADLESS !== 'false'
const isCI = process.env.INNODOC_WEBAPP_CI === 'true'

let jestTimeout = 1000 * 120

if (!headless || isCI) {
  jestTimeout *= 5
}

jest.setTimeout(jestTimeout)
