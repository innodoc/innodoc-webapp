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
    await helpers.clickNavSubmenu(email, 'Change password')
    expect(await page.title()).toBe('Change password · innoDoc')
    await page.type('input#change-password-form_old-password', pwd)
    await page.type('input#change-password-form_password', newPwd)
    await page.type('input#change-password-form_confirm-password', newPwd)
    await page.click('form#change-password-form button[type=submit]')
    await page.waitForSelector('"Password changed."')

    await helpers.logout(email)
    await helpers.login(email, newPwd)
  })

  test('Reset password', async () => {
    const email = helpers.getRandEmail()
    await helpers.goto()
    await helpers.register(email, pwd)
    await helpers.activate(email)

    // Request password reset
    await page.click('a[href="/login"]')
    await page.type('input#login-form_email', email)
    await page.type('input#login-form_password', 'wrongPwd')
    await page.click('button >> "Sign-in"')
    await page.click(`"I don't remember my password"`)
    await page.type('input#request-password-reset-form_email', email)
    expect(await page.title()).toBe('Reset password · innoDoc')
    await page.click('button >> "Request"')
    await page.waitForSelector('"Password reset mail sent."')

    // Reset password
    const newPwd = '123ABCabcStr0ng!'
    const user = await helpers.getUser(email)
    await helpers.goto(`reset-password/${user.passwordResetToken}`)
    await page.type('input#reset-password-form_password', newPwd)
    await page.type('input#reset-password-form_confirm-password', newPwd)
    await page.click('button >> "Set new password"')
    await page.waitForSelector('"New password set."')
    await helpers.login(email, newPwd)
  })

  test('Request verification mail', async () => {
    const email = helpers.getRandEmail()
    await helpers.goto()
    await helpers.register(email, pwd)
    await helpers.goto('login')
    await page.type('input#login-form_email', email)
    await page.type('input#login-form_password', 'wrongPwd')
    await page.click('button >> "Sign-in"')
    await page.click('"Request confirmation mail"')
    await page.type('input#request-verification-form_email', email)
    await page.click('"Request"')
    await page.waitForSelector('"Confirmation mail was sent."')
  })

  test('Account deletion', async () => {
    const email = helpers.getRandEmail()
    await helpers.goto()
    await helpers.register(email, pwd)
    await helpers.activate(email)
    await helpers.login(email, pwd)
    await helpers.goto('delete-account')
    await page.type('input#delete-account-form_password', pwd)
    await page.click('"Delete account permanently"')
    await page.waitForSelector('.ant-result >> "Account deleted!"')
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
      await page.click('[class*=header___] >> "About"')
      await page.waitForSelector('[class*=content___] >> "About this course"')
      await helpers.logout(email)
    })

    describe('Field validation', () => {
      it('should validate email', async () => {
        await helpers.goto('register')
        await page.type('input#registration-form_email', 'no-valid-email@')
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
        await page.type('input#registration-form_password', testPwd)
        await page.waitForSelector(`"${msg}"`)
      })

      it('should validate passwords match', async () => {
        await helpers.goto('register')
        await page.type('input#registration-form_password', 'pa55w0rd!')
        await page.type('input#registration-form_confirm-password', 'pa55w0rd')
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
      await page.type('input#login-form_email', email)
      await page.type('input#login-form_password', pwd)
      await page.click('"Sign-in"')
      await page.waitForSelector('"Login failed!"')
    })

    test('fails due to bad credentials', async () => {
      const email = helpers.getRandEmail()
      await helpers.goto()
      await page.click('"Login"')
      await page.type('input#login-form_email', email)
      await page.type('input#login-form_password', 'wrongPwd')
      await page.click('"Sign-in"')
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
      await page.waitForSelector(`[class*=nav___] >> "${email}"`)
    })
  })
})
