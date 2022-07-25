import userEvent from '@testing-library/user-event'
import { rest } from 'msw'

import { render, screen, waitFor } from 'test-utils.js'
import { getUrl } from 'api-mock/handlers.js'
import mockServer from 'api-mock/server.js'

import Login from 'pages/login.js'

test('show error with incorrect credentials', async () => {
  mockServer.use(rest.post(getUrl('/user/login'), (req, res, ctx) => res(ctx.status(403))))

  const user = userEvent.setup()
  render(<Login />)

  const emailInput = screen.getByRole('textbox')
  const passwordInput = screen.getByPlaceholderText(/password/i)

  await user.type(emailInput, 'test@example.com')
  await user.type(passwordInput, 'wr0ngPwd')
  await user.click(screen.getByRole('button', { name: /sign-in/i }))

  await waitFor(() => expect(screen.getByText(/login failed/i)).toBeInTheDocument())
})
