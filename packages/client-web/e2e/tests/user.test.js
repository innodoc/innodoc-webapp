import mongoose from 'mongoose'
import User from '@innodoc/server/dist/models/User'

const getRandEmail = () => {
  const randString = Math.random().toString(36).substring(2)
  return `user-${randString}@example.com`
}

const connectDb = async () => {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}

describe('User flows', () => {
  const pwd = 'S00perSecur3!'

  beforeAll(() => connectDb())
  afterAll(() => mongoose.disconnect())
  beforeEach(async () => {
    await jestPuppeteer.resetBrowser()
    await page.setViewport({ width: 1200, height: 600 })
    await page.goto(getUrl())
    await page.waitFor(250)
  })

  const register = async (email) => {
    const userMenu = await page.waitForXPath("//li[contains(., 'Login')]")
    await userMenu.hover()
    await page.waitFor(250)
    await expect(page).toClick('a', { text: 'Create account' })
    await expect(page).toFill('input#registration-form_email', email)
    await expect(page).toFill('input#registration-form_password', pwd)
    await expect(page).toFill('input#registration-form_confirm-password', pwd)
    await expect(page).toClick('button', { text: 'Create account' })
    await expect(page).toMatch('Account created!')
    await page.waitFor(250)
  }

  const activate = async (email) => {
    const user = await User.findOne({ email })
    expect(user).toBeTruthy()
    await page.goto(getUrl(`verify-user/${user.emailVerificationToken}`))
    await expect(page).toMatch('Account activated')
  }

  test('Registration > Verification > Login > Logout', async (done) => {
    const email = getRandEmail()
    await register(email)
    await activate(email)

    // Login
    await page.goto(getUrl('login'))
    await expect(page).toFill('input#login-form_email', email)
    await expect(page).toFill('input#login-form_password', pwd)
    await expect(page).toClick('button', { text: 'Sign-in' })
    await expect(page).toMatch('Successfully logged in.')
    await expect(page).toMatchElement('li', email)

    // Logout
    const userMenu = await page.waitForXPath(`//li[contains(., '${email}')]`)
    await userMenu.hover()
    await page.waitFor(250)
    await expect(page).toClick('a', { text: 'Logout' })
    await expect(page).toMatch('You have been logged out.')

    done()
  })

  test('Registration > Login fail', async (done) => {
    const email = getRandEmail()
    await register(email)
    await page.goto(getUrl('login'))
    await expect(page).toFill('input#login-form_email', email)
    await expect(page).toFill('input#login-form_password', pwd)
    await expect(page).toClick('button', { text: 'Sign-in' })
    await expect(page).toMatch('Login failed!')

    done()
  })

  test('Registration > Verification > Login > Change password > Logout > Login', async (done) => {
    let userMenu
    const email = getRandEmail()
    await register(email)
    await activate(email)

    // Login
    await page.goto(getUrl('login'))
    await expect(page).toFill('input#login-form_email', email)
    await expect(page).toFill('input#login-form_password', pwd)
    await expect(page).toClick('button', { text: 'Sign-in' })

    // Change password
    const newPwd = '123ABCabc!new'
    userMenu = await page.waitForXPath(`//li[contains(., '${email}')]`)
    await userMenu.hover()
    await page.waitFor(250)
    await expect(page).toClick('a', { text: 'Change password' })
    await expect(page).toFill('input#change-password-form_old-password', pwd)
    await expect(page).toFill('input#change-password-form_password', newPwd)
    await expect(page).toFill(
      'input#change-password-form_confirm-password',
      newPwd
    )
    await expect(page).toClick('button', { text: 'Change password' })
    await expect(page).toMatch('Password changed.')

    // Logout
    await page.mouse.move(0, 0)
    userMenu = await page.waitForXPath(`//li[contains(., '${email}')]`)
    await userMenu.hover()
    await page.waitFor(250)
    await expect(page).toClick('a', { text: 'Logout' })
    await expect(page).toMatch('You have been logged out.')

    // Login
    userMenu = await page.waitForXPath("//li[contains(., 'Login')]")
    await userMenu.hover()
    await page.waitFor(250)
    await expect(page).toClick('a', { text: 'Login' })
    await expect(page).toFill('input#login-form_email', email)
    await expect(page).toFill('input#login-form_password', newPwd)
    await expect(page).toClick('button', { text: 'Sign-in' })
    await expect(page).toMatch('Successfully logged in.')
    await expect(page).toMatchElement('li', email)

    done()
  })

  test('Login fail', async (done) => {
    const userMenu = await page.waitForXPath("//li[contains(., 'Login')]")
    await userMenu.hover()
    await page.waitFor(250)
    await expect(page).toClick('a', { text: 'Login' })
    await expect(page).toFill('input#login-form_email', 'nope@example.com')
    await expect(page).toFill('input#login-form_password', '123ABCabc!')
    await expect(page).toClick('button', { text: 'Sign-in' })
    await expect(page).toMatch('Login failed!')
    done()
  })
})
