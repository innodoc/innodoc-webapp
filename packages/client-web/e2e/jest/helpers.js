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
    await page.hover(`header >> "${menuText}"`)
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
    await helpers.goto('register')
    await page.waitForSelector('h1 >> text=Create account')
    expect(await page.title()).toBe('Create account · innoDoc')
    await page.fill('input[autocomplete="email"]', email)
    const pwdInputs = await page.$$('input[type=password]')
    await pwdInputs[0].fill(pwd)
    await pwdInputs[1].fill(pwd)
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
    const { expect, helpers, page } = env.global
    await helpers.goto('login')
    await page.waitForSelector('h1 >> text=Login')
    expect(await page.title()).toBe('Login · innoDoc')
    await page.fill('input[placeholder="Email"]', email)
    await page.fill('input[placeholder="Password"]', pwd)
    await page.click('"Sign-in"')
    if (expectFailed) {
      await expect(page).toHaveText('Login failed!')
    } else {
      await page.waitForSelector('"Successfully logged in."')
      await page.waitForSelector(`header >> "${email}"`)
    }
  },

  logout: async () => {
    const { helpers, page } = env.global
    await helpers.goto('logout')
    await page.waitForSelector("'You have been logged out.'")
  },

  getUser: (email) => User.findOne({ email }),
})

module.exports = testHelpers
