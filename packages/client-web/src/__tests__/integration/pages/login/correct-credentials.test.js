import userEvent from '@testing-library/user-event'

import { render, screen, waitFor } from 'test-utils.js'
import LoginPage from 'pages/login.js'

test('login with correct credentials', async () => {
  const user = userEvent.setup()
  render(<LoginPage />)

  const emailInput = screen.getByRole('textbox')
  const passwordInput = screen.getByPlaceholderText(/password/i)

  await user.type(emailInput, 'test@example.com')
  await user.type(passwordInput, 's3cr3t')
  await user.click(screen.getByRole('button', { name: /sign-in/i }))

  await waitFor(() => expect(screen.getByText(/successfully logged in/i)).toBeInTheDocument())
})
