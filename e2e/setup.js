import { setDefaultOptions } from 'expect-puppeteer'
import registerScreenshotReporter from './screenshotReporter'

setDefaultOptions({ timeout: 2000 }) // for a single puppeteer command
jest.setTimeout(15000) // for a single test

// take screenshots on failed tests for better debugging
registerScreenshotReporter()

// provide URL to tests
global.getUrl = (rest = '') => `http://localhost:${process.env.PROD_PORT}${rest}`;

// force language
(async () => {
  await global.page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US' })
})()
