/* eslint-disable no-param-reassign */
const Wendigo = require('wendigo')

const escapeXPathString = (str) => {
  const splitedQuotes = str.replace(/'/g, `', "'", '`)
  return `concat('${splitedQuotes}', '')`
}

const testHelpers = (env) => {
  env.global.getUrl = (rest = '') => `${process.env.APP_ROOT}${rest}`

  env.global.openUrl = async (urlFragment, opts = {}) => {
    const mergedOpts = { skipDataConsent: true, ...opts }
    if (mergedOpts.skipDataConsent) {
      await env.global.browser.cookies.set('data-consent', {
        url: env.global.getUrl(),
        value: 'true',
      })
    }
    await env.global.browser.open(env.global.getUrl(urlFragment), {
      headers: { 'Accept-Language': 'en-US' },
      viewport: { width: 1200, height: 600 },
      ...mergedOpts,
    })
    await env.global.browser.waitFor(
      '//div[contains(@class, "header")]/./span[text()[contains(.,"innoDoc")]]'
    )
    await env.global.browser.waitFor('//div[contains(@class, "content___")]/*')
    await env.global.browser.waitFor('//footer[contains(@class, "footer___")]/*')
  }

  env.global.hoverNavItem = async (text) => {
    const escaped = escapeXPathString(text)
    await env.global.browser.page.mouse.move(0, 0)
    await env.global.browser.hover(
      `//ul[contains(@class,"nav___")]/li//*[text()[contains(.,${escaped})]]`
    )
    await env.global.browser.wait(500)
  }

  env.global.resetBrowser = async () => {
    if (env.global.browser) {
      await env.global.browser.close()
    }
    env.global.browser = await Wendigo.createBrowser(env.wendigoOpts)
  }
}

module.exports = testHelpers
