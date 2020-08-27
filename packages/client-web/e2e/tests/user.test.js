beforeEach(resetBrowser)
beforeAll(connectDb)
afterAll(disconnectDb)

describe('Account interactions', () => {
  const pwd = 'S00perSecur3!'

  test('Change password', async () => {
    const email = getRandEmail()
    await openUrl()
    await register(email, pwd)
    await activate(email)
    await login(email, pwd)

    const newPwd = '123ABCabc!new'
    await hoverNavItem(email)
    await browser.waitForText('Change password')
    await browser.clickText('Change password')
    await browser.waitAndType('input#change-password-form_old-password', pwd)
    await browser.type('input#change-password-form_password', newPwd)
    await browser.type('input#change-password-form_confirm-password', newPwd)
    expect(await browser.title()).toBe('Change password · innoDoc')
    const submitBtn = await browser.query('form#change-password-form button[type=submit]')
    await browser.click(submitBtn)
    await browser.waitForText('Password changed.')

    await logout(email)
    await login(email, newPwd)
  })

  test('Request password', async () => {
    const email = getRandEmail()
    await openUrl()
    await register(email, pwd)
    await activate(email)
    // Request password reset
    await browser.click('a[href="/login"]')
    await browser.waitAndType('input#login-form_email', email)
    await browser.type('input#login-form_password', 'wrongPwd')
    await browser.clickText('Sign-in')
    await browser.waitFor('.ant-alert')
    const pwdResetLink = await browser.query('.ant-alert a[href="/request-password-reset"]')
    await browser.click(pwdResetLink)
    await browser.waitAndType('input#request-password-reset-form_email', email)
    expect(await browser.title()).toBe('Reset password · innoDoc')
    await browser.clickText('Request')
    await browser.waitForText('Password reset mail sent.')
    // Reset password
    const newPwd = '123ABCabcStr0ng!'
    const user = await getUser(email)
    await openUrl(`reset-password/${user.passwordResetToken}`)
    await browser.waitAndType('input#reset-password-form_password', newPwd)
    await browser.type('input#reset-password-form_confirm-password', newPwd)
    await browser.clickText('Set new password')
    await browser.waitForText('New password set.')
    await login(email, newPwd)
  })

  test('Request verification mail', async () => {
    const email = getRandEmail()
    await openUrl()
    await register(email, pwd)
    await openUrl('login')
    await browser.waitAndType('input#login-form_email', email)
    await browser.type('input#login-form_password', 'wrongPwd')
    await browser.clickText('Sign-in')
    await browser.waitFor('.ant-alert')
    const requestVerificationLink = await browser.query(
      '.ant-alert a[href="/request-verification"]'
    )
    await browser.click(requestVerificationLink)
    await browser.waitAndType('input#request-verification-form_email', email)
    await browser.clickText('Request')
    await browser.waitForText('Confirmation mail was sent.')
  })

  test('Account deletion', async () => {
    const email = getRandEmail()
    await openUrl()
    await register(email, pwd)
    await activate(email)
    await login(email, pwd)
    await openUrl('delete-account')
    await browser.waitAndType('input#delete-account-form_password', pwd)
    await browser.clickText('Delete account permanently')
    await browser.waitFor('.ant-result')
    await browser.assert.textContains('.ant-result', 'Account deleted!')
    await openUrl()
    await browser.waitForText('Login') // makes sure we're logged out
    await openUrl('login')
    await browser.waitAndType('input#login-form_email', email)
    await browser.type('input#login-form_password', pwd)
    await browser.clickText('Sign-in')
    await browser.waitForText('Login failed!')
  })

  describe('Registration', () => {
    test('Verification > Login > About > Logout', async () => {
      const email = getRandEmail()
      await openUrl()
      await register(email, pwd)
      await activate(email)
      await login(email, pwd)
      await browser.waitFor('[class*=header___] ul[class*=nav___] a[href="/page/about"]')
      await browser.click('[class*=header___] ul[class*=nav___] a[href="/page/about"]')
      await browser.waitForNavigation()
      await browser.waitForText('About this course')
      await logout(email)
    })

    describe('Field validation', () => {
      it('should validate email', async () => {
        await openUrl('register')
        await browser.waitAndType('input#registration-form_email', 'no-valid-email@')
        await browser.waitForText('Please enter valid email!')
      })

      it.each([
        ['abcabc123!', 'The password must contain at least one uppercase letter!'],
        ['AAAAAA1!', 'The password must contain at least one lowercase letter!'],
        ['Aa1!', 'The password needs to have a minimum of 8 characters!'],
        ['aaaaAAA!', 'The password must contain at least one digit!'],
        ['aaaaAAA1', 'The password must contain at least one symbol!'],
      ])('should validate password (%s)', async (testPwd, msg) => {
        await openUrl('register')
        await browser.waitAndType('input#registration-form_password', testPwd)
        await browser.waitForText(msg)
      })

      it('should validate passwords match', async () => {
        await openUrl('register')
        await browser.waitAndType('input#registration-form_password', 'pa55w0rd!')
        await browser.type('input#registration-form_confirm-password', 'pa55w0rd')
        await browser.waitForText('The passwords you entered have to match!')
      })
    })
  })

  describe('Login', () => {
    test('fails w/o activation', async () => {
      const email = getRandEmail()
      await openUrl()
      await register(email, pwd)
      await openUrl('login')
      await browser.waitAndType('input#login-form_email', email)
      await browser.type('input#login-form_password', pwd)
      await browser.clickText('Sign-in')
      await browser.waitForText('Login failed!')
    })

    test('fails due to bad credentials', async () => {
      const email = getRandEmail()
      await openUrl()
      await browser.click('a[href="/login"]')
      await browser.waitAndType('input#login-form_email', email)
      await browser.type('input#login-form_password', 'wrongPwd')
      await browser.clickText('Sign-in')
      await browser.waitForText('Login failed!')
    })

    test('using JWT cookie', async () => {
      const email = getRandEmail()
      await openUrl()
      await register(email, pwd)
      await activate(email)
      await login(email, pwd)
      await openUrl()
      await browser.assert.textContains('[class*=nav___]', email)
    })
  })
})
