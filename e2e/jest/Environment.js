const { resolve } = require('path')
const PlaywrightEnvironment = require('jest-playwright-preset/lib/PlaywrightEnvironment').default
const helpers = require('./helpers')

class CustomEnvironment extends PlaywrightEnvironment {
  async setup() {
    await super.setup()
    this.global.helpers = helpers(this)

    // TODO: Remove when https://github.com/playwright-community/jest-playwright/issues/343 is released
    const [playwrightJestErrorHandler] = this.global.page.listeners('pageerror')
    // eslint-disable-next-line no-underscore-dangle
    const { exitOnPageError } = this._jestPlaywrightConfig
    this.global.jestPlaywright.resetPage = async () => {
      const { context, page } = this.global
      try {
        if (page) {
          page.removeListener('pageerror', playwrightJestErrorHandler)
          await page.close()
        }
        // eslint-disable-next-line no-empty
      } catch (e) {}

      this.global.page = await context.newPage()
      if (exitOnPageError) {
        this.global.page.addListener('pageerror', playwrightJestErrorHandler)
      }
    }
  }

  // Take screenshot on failed test
  async handleTestEvent(event) {
    if (event.name === 'test_done' && event.test.errors.length > 0) {
      const parentName = event.test.parent.name.replace(/\W/g, '-')
      const specName = event.test.name.replace(/\W/g, '-')
      const now = new Date()
      const filename = `${now.toISOString()}_${parentName}_${specName}.png`
      const path = resolve(__dirname, '..', 'screenshots', filename)
      try {
        await this.global.page.screenshot({ path })
      } catch (err) {
        /* eslint-disable no-console */
        console.error('Could not save browser screenshot!')
        console.error(err)
        /* eslint-enable no-console */
      }
    }
  }
}

module.exports = CustomEnvironment
