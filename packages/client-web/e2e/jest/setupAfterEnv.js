import { setDefaultOptions } from 'expect-puppeteer'
import registerScreenshotReporter from './screenshotReporter'

setDefaultOptions({ timeout: 5000 }) // for a single puppeteer command
jest.setTimeout(15000) // for a single test

// take screenshots on failed tests for better debugging
registerScreenshotReporter()

// provide URL to tests
global.getUrl = (rest = '') => `${process.env.APP_ROOT}${rest}`

// force language
const forceLanguage = async () => {
  await global.page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US' })
}
forceLanguage()
