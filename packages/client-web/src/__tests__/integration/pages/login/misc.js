import router from 'next/router'
import userEvent from '@testing-library/user-event'

import { render, screen, waitFor } from 'test-utils.js'
import LoginPage from 'pages/login.js'

test('show login form and links', () => {
  render(<LoginPage />)
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/login/i)
  expect(screen.getByRole('button', { name: /Sign-in/ })).toBeInTheDocument()
})

test('have link to /register', async () => {
  const user = userEvent.setup()
  render(<LoginPage />)

  const registerLink = screen.getByRole('link', { name: /create new account/i })
  await user.click(registerLink)
  expect(router.asPath).toBe('/register')
})

xtest('not show sidebar', () => {})
