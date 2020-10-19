const User = require('@innodoc/server/dist/models/User').default

const testHelpers = (env) => ({
  getUrl: (rest = '') => `${process.env.APP_ROOT}${rest}`,

  goto: async (urlFragment, skipDataConsent = true) => {
    const { context, helpers, page } = env.global
    if (skipDataConsent) {
      await context.addCookies([
        {
          name: 'data-consent',
          url: helpers.getUrl(),
          value: 'true',
        },
      ])
    }
    return page.goto(helpers.getUrl(urlFragment))
  },

  clickNavSubmenu: async (menuText, itemText) => {
    const { page } = env.global
    // First move mouse away, this ensures the submenu element receives a
    // mouseenter event.
    await page.mouse.move(10, 200)
    await page.waitForTimeout(500)
    await page.hover(`[class*=nav___] >> "${menuText}"`)
    await page.click(`.ant-menu-submenu-popup >> "${itemText}"`)
  },

  getCookie: (name) =>
    new Promise((resolve, reject) => {
      let attempt = 0
      const checkForCookie = () =>
        env.global.context.cookies().then((cookies) => {
          const cookie = cookies.find((c) => c.name === name)
          if (cookie) {
            resolve(cookie)
          } else if (attempt < 50) {
            attempt += 1
            setTimeout(checkForCookie, 50)
          } else {
            reject(new Error(`Cookie ${name} not found!`))
          }
        })
      checkForCookie()
    }),

  getRandEmail: () => {
    const randStr = Math.random().toString(36).substring(2)
    return `${randStr}@a.com`
  },

  register: async (email, pwd) => {
    const { expect, helpers, page } = env.global
    await helpers.clickNavSubmenu('Login', 'Create account')
    await page.waitForSelector('"Create account"')
    expect(await page.title()).toBe('Create account · innoDoc')
    await page.type('input#registration-form_email', email)
    await page.type('input#registration-form_password', pwd)
    await page.type('input#registration-form_confirm-password', pwd)
    await page.click('"Create account"')
    await page.waitForSelector('"Account created!"')
  },

  activate: async (email) => {
    const { expect, helpers, page } = env.global
    const user = await User.findOne({ email })
    await helpers.goto(`verify-user/${user.emailVerificationToken}`)
    await page.waitForSelector('"Account activated"')
    expect(await page.title()).toBe('Account activated · innoDoc')
  },

  login: async (email, pwd, expectFailed = false) => {
    const { expect, page } = env.global
    await page.click('[class*=nav___] a[href="/login"]')
    await page.waitForSelector('input#login-form_email')
    expect(await page.title()).toBe('Login · innoDoc')
    await page.type('input#login-form_email', email)
    await page.type('input#login-form_password', pwd)
    await page.click('"Sign-in"')
    await page.waitForSelector(expectFailed ? '"Login failed!"' : '"Successfully logged in."')
    await page.waitForSelector(expectFailed ? '"Login"' : `"${email}"`)
  },

  logout: async (email) => {
    const { helpers, page } = env.global
    await helpers.clickNavSubmenu(email, 'Logout')
    await page.waitForSelector("'You have been logged out.'")
  },

  getUser: (email) => User.findOne({ email }),
})

module.exports = testHelpers
