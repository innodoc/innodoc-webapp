import { loadPage, render, screen } from '#test-utils'

import { Page as ContentPage } from '#pages/page/index.page'

test('<ContentPage />', async () => {
  await loadPage('home')

  render(<ContentPage />)
  expect(screen.getByRole('heading', { name: 'Home page', exact: true })).toBeInTheDocument()
  expect(screen.getByText(/this is the start of the journey/i)).toBeInTheDocument()

  const linkEl = screen.getByRole('link', { name: 'example link' })
  expect(linkEl).toHaveAttribute('href', 'https://www.example.com/')

  const linkElRef = screen.getByRole('link', { name: 'example link reference' })
  expect(linkElRef).toHaveAttribute('href', 'https://www.example.com/reference')
})
