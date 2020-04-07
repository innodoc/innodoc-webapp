import { setDefaultOptions } from 'expect-puppeteer'
import registerScreenshotReporter from './screenshotReporter'

const headless = process.env.PUPPETEER_HEADLESS !== 'false'

// for a single puppeteer command
setDefaultOptions({ timeout: headless ? 15000 : 120000 })
// for a single test
jest.setTimeout(headless ? 60000 : 1000 * 60 * 10)

// take screenshots on failed tests for better debugging
registerScreenshotReporter()

// provide URL to tests
global.getUrl = (rest = '') => `${process.env.APP_ROOT}${rest}`

// force language
const forceLanguage = async () => {
  await global.page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US' })
}
forceLanguage()
