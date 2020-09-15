/* eslint-disable no-param-reassign */
const Wendigo = require('wendigo')
const mongoose = require('mongoose')

const User = require('@innodoc/server/dist/models/User').default

const defaultOpenOpts = {
  headers: { 'Accept-Language': 'en-US' },
  skipDataConsent: true,
  viewport: { width: 1200, height: 600 },
}

const escapeXPathString = (str) => {
  const splitedQuotes = str.replace(/'/g, `', "'", '`)
  return `concat('${splitedQuotes}', '')`
}

const testHelpers = (env) => {
  env.global.getUrl = (rest = '') => `${process.env.APP_ROOT}${rest}`

  env.global.openUrl = async (urlFragment, userOpts = {}) => {
    const { skipDataConsent, ...opts } = { ...defaultOpenOpts, ...userOpts }

    if (skipDataConsent) {
      await env.global.browser.cookies.set('data-consent', {
        url: env.global.getUrl(),
        value: 'true',
      })
    }

    await env.global.browser.open(env.global.getUrl(urlFragment), opts)
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

  env.global.getRandEmail = () => {
    const randString = Math.random().toString(36).substring(2)
    return `user-${randString}@example.com`
  }

  env.global.register = async (email, pwd) => {
    await env.global.hoverNavItem('Login')
    await env.global.browser.waitForText('Create account')
    await env.global.browser.clickText('Create account')
    await env.global.browser.waitAndType('input#registration-form_email', email)
    await env.global.browser.type('input#registration-form_password', pwd)
    await env.global.browser.type('input#registration-form_confirm-password', pwd)
    await env.global.browser.assert.title('Create account · innoDoc')
    await env.global.browser.clickText('Create account')
    await env.global.browser.waitFor('.ant-result')
    await env.global.browser.assert.textContains('.ant-result', 'Account created!')
    await env.global.browser.wait(500)
  }

  env.global.activate = async (email) => {
    const user = await User.findOne({ email })
    await env.global.openUrl(`verify-user/${user.emailVerificationToken}`)
    await env.global.browser.waitFor('.ant-result')
    await env.global.browser.assert.textContains('.ant-result', 'Account activated')
    await env.global.browser.assert.title('Account activated · innoDoc')
  }

  env.global.login = async (email, pwd, expectFailed = false) => {
    await env.global.browser.waitAndClick('[class*=nav___] a[href="/login"]')
    await env.global.browser.waitAndType('input#login-form_email', email)
    await env.global.browser.type('input#login-form_password', pwd)
    await env.global.browser.assert.title('Login · innoDoc')
    await env.global.browser.clickText('Sign-in')
    await env.global.browser.waitForText(expectFailed ? 'Login failed!' : 'Successfully logged in.')
  }

  env.global.logout = async (email) => {
    await env.global.hoverNavItem(email)
    await env.global.browser.waitForText('Logout')
    await env.global.browser.clickText('Logout')
    await env.global.browser.waitForText('You have been logged out.')
  }

  env.global.connectDb = () =>
    mongoose.connect(process.env.MONGO_URL, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

  env.global.disconnectDb = mongoose.disconnect

  env.global.getUser = (email) => User.findOne({ email })

  env.global.resetBrowser = async () => {
    if (env.global.browser) {
      await env.global.browser.close()
    }
    env.global.browser = await Wendigo.createBrowser(env.wendigoOpts)
  }
}

module.exports = testHelpers
