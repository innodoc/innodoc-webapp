beforeEach(async () => {
  await jestPlaywright.resetContext()
})

describe('Account interactions', () => {
  const pwd = 'S00perSecur3!'

  test('Change password', async () => {
    const email = helpers.getRandEmail()
    await helpers.goto()
    await helpers.register(email, pwd)
    await helpers.activate(email)
    await helpers.login(email, pwd)

    const newPwd = '123ABCabc!new'
    await helpers.goto('change-password')
    await page.waitForSelector('h1 >> "Change password"')
    expect(await page.title()).toBe('Change password · innoDoc')
    const pwdInputs = await page.$$('input[type=password]')
    await pwdInputs[0].fill(pwd)
    await pwdInputs[1].fill(newPwd)
    await pwdInputs[2].fill(newPwd)
    await page.click('button >> "Change password"')
    await page.waitForSelector('"Password changed."')

    await helpers.logout()
    await helpers.login(email, newPwd)
  })

  test('Reset password', async () => {
    const email = helpers.getRandEmail()
    await helpers.goto()
    await helpers.register(email, pwd)
    await helpers.activate(email)

    // Request password reset
    await helpers.goto('login')
    await page.waitForSelector('h1 >> text=Login')
    await page.fill('input[placeholder="Email"]', email)
    await page.fill('input[placeholder="Password"]', 'wrongPwd')
    await page.click('button >> "Sign-in"')
    await page.click(`"I don't remember my password"`)
    await page.waitForSelector('h1 >> "Reset password"')
    expect(await page.title()).toBe('Reset password · innoDoc')
    await page.fill('input[autocomplete="email"]', email)
    await page.click('button >> "Request"')
    await page.waitForSelector('"Password reset mail sent."')

    // Reset password
    const newPwd = '123ABCabcStr0ng!'
    const user = await helpers.getUser(email)
    await helpers.goto(`reset-password/${user.passwordResetToken}`)
    const pwdInputs = await page.$$('input[type=password]')
    await pwdInputs[0].fill(newPwd)
    await pwdInputs[1].fill(newPwd)
    await page.click('button >> "Set new password"')
    await page.waitForSelector('"New password set."')
    await helpers.login(email, newPwd)
  })

  test('Request verification mail', async () => {
    const email = helpers.getRandEmail()
    await helpers.goto()
    await helpers.register(email, pwd)
    await helpers.goto('login')
    await page.waitForSelector('h1 >> text=Login')
    await page.fill('input[placeholder="Email"]', email)
    await page.fill('input[placeholder="Password"]', 'wrongPwd')
    await page.click('button >> "Sign-in"')
    await page.click('"Request confirmation mail"')
    await page.fill('input[autocomplete="email"]', email)
    await page.click('button >> "Request"')
    await page.waitForSelector('"Confirmation mail was sent."')
  })

  test('Account deletion', async () => {
    const email = helpers.getRandEmail()
    await helpers.goto()
    await helpers.register(email, pwd)
    await helpers.activate(email)
    await helpers.login(email, pwd)
    await helpers.goto('delete-account')
    await page.waitForSelector('h1 >> "Delete account"')
    const pwdInput = await page.$('input[type=password]')
    await pwdInput.fill(pwd)
    await page.click('button >> "Delete account permanently"')
    await page.waitForSelector('"Account deleted!"')
    await helpers.goto()
    await helpers.login(email, pwd, true)
  })

  describe('Registration', () => {
    test('Verification > Login > About > Logout', async () => {
      const email = helpers.getRandEmail()
      await helpers.goto()
      await helpers.register(email, pwd)
      await helpers.activate(email)
      await helpers.login(email, pwd)
      await page.click('header >> "About"')
      await page.waitForSelector('"About this course"')
      await helpers.logout()
    })

    describe('Field validation', () => {
      it('should validate email', async () => {
        await helpers.goto('register')
        await page.fill('input[autocomplete="email"]', 'no-valid-email@')
        await page.waitForSelector('"Please enter valid email!"')
      })

      it.each([
        ['abcabc123!', 'The password must contain at least one uppercase letter!'],
        ['AAAAAA1!', 'The password must contain at least one lowercase letter!'],
        ['Aa1!', 'The password needs to have a minimum of 8 characters!'],
        ['aaaaAAA!', 'The password must contain at least one digit!'],
        ['aaaaAAA1', 'The password must contain at least one symbol!'],
      ])('should validate password (%s)', async (testPwd, msg) => {
        await helpers.goto('register')
        const pwdInput = await page.$('input[type=password]')
        await pwdInput.fill(testPwd)
        await page.waitForSelector(`"${msg}"`)
      })

      it('should validate passwords match', async () => {
        await helpers.goto('register')
        const pwdInputs = await page.$$('input[type=password]')
        await pwdInputs[0].fill('pa55w0rd!')
        await pwdInputs[1].fill('pa55w0rd')
        await page.waitForSelector('"The passwords you entered have to match!"')
      })
    })
  })

  describe('Login', () => {
    test('fails w/o activation', async () => {
      const email = helpers.getRandEmail()
      await helpers.goto()
      await helpers.register(email, pwd)
      await helpers.goto('login')
      await page.waitForSelector('h1 >> text=Login')
      await page.fill('input[placeholder="Email"]', email)
      await page.fill('input[placeholder="Password"]', pwd)
      await page.click('button >> "Sign-in"')
      await page.waitForSelector('"Login failed!"')
    })

    test('fails due to bad credentials', async () => {
      const email = helpers.getRandEmail()
      await helpers.goto('login')
      await page.waitForSelector('h1 >> text=Login')
      await page.fill('input[placeholder="Email"]', email)
      await page.fill('input[placeholder="Password"]', 'wrongPwd')
      await page.click('button >> "Sign-in"')
      await page.waitForSelector('"Login failed!"')
    })

    test('using JWT cookie', async () => {
      const email = helpers.getRandEmail()
      await helpers.goto()
      await helpers.register(email, pwd)
      await helpers.activate(email)
      await helpers.login(email, pwd)
      const cookie = await helpers.getCookie('accessToken')
      expect(cookie.value.length).toBeGreaterThan(0)
      await helpers.goto()
      await page.waitForSelector(`header >> "${email}"`)
    })
  })
})
