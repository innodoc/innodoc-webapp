import router from 'next/router'

import userEvent from '@testing-library/user-event'

import { render, screen, waitFor } from 'test-utils.js'
import Login from 'pages/login.js'

const oldWindowLocation = window.location

// Mocking window.location
// https://www.benmvp.com/blog/mocking-window-location-methods-jest-jsdom/

beforeAll(() => {
  delete window.location

  window.location = Object.defineProperties(
    {},
    {
      ...Object.getOwnPropertyDescriptors(oldWindowLocation),
      replace: {
        configurable: true,
        value: jest.fn(),
      },
    }
  )
})

afterAll(() => {
  window.location = oldWindowLocation
})

test('navigate to redirect_to query param after login', async () => {
  router.query.redirect_to = 'http://example.com/foo/bar'

  const user = userEvent.setup()
  render(<Login />)

  const emailInput = screen.getByRole('textbox')
  const passwordInput = screen.getByPlaceholderText(/password/i)

  await user.type(emailInput, 'test@example.com')
  await user.type(passwordInput, 's3cr3t')
  await user.click(screen.getByRole('button', { name: /sign-in/i }))

  await waitFor(() => expect(screen.getByText(/successfully logged in/i)).toBeInTheDocument())

  expect(window.location.replace).toBeCalledWith('http://example.com/foo/bar')
})
