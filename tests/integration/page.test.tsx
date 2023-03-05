import { loadPage, render, screen } from '#test-utils'

import { Page } from '#pages/page/index.page'

test('pages/page', async () => {
  await loadPage('home')

  render(<Page />)
  expect(screen.getByTestId('main-container')).toBeInTheDocument()

  await screen.findByRole('heading', { name: 'Home page' })
  await screen.findByText(/this is the start of the journey/i)

  const linkEl = screen.queryByRole('link', { name: 'example link' })
  expect(linkEl).toHaveAttribute('href', 'https://www.example.com/')

  const linkElRef = screen.queryByRole('link', { name: 'example link reference' })
  expect(linkElRef).toHaveAttribute('href', 'https://www.example.com/reference')
})
