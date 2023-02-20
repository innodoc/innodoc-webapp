import { fireEvent, loadPage, render, screen } from '#test-utils'

import { Page as ContentPage } from '#pages/page/index.page'

test('change language', async () => {
  await loadPage('home')

  render(<ContentPage />)

  // Check en version
  expect(screen.getByRole('heading', { name: 'Home page', level: 1 })).toBeInTheDocument()
  expect(screen.getAllByText('Course for integration tests').at(0)).toBeInTheDocument()
  expect(screen.getByText('This is the start of the journey.')).toBeInTheDocument()
  let link = screen.getByRole('link', { name: 'example link' })
  expect(link).toHaveAttribute('href', 'https://www.example.com/')

  // Change language to de
  fireEvent.click(screen.getByRole('button', { name: 'nav.language' }))
  fireEvent.click(await screen.findByRole('menuitem', { name: 'languages.de' }))

  // Check de version
  await screen.findByRole('heading', { name: 'Home-Seite', level: 1 })
  await screen.findAllByText('Kurs für integration tests')
  await screen.findByText('Dies ist der Beginn der Reise.')
  link = screen.getByRole('link', { name: 'Beispiel-Link' })
  expect(link).toHaveAttribute('href', 'https://www.example.com/')

  // Change language back to en
  fireEvent.click(screen.getByRole('button', { name: 'nav.language' }))
  fireEvent.click(screen.getByRole('menuitem', { name: 'languages.en' }))

  // Check en version
  await screen.findByRole('heading', { name: 'Home page', level: 1 })
  await screen.findAllByText('Course for integration tests')
  await screen.findByText('This is the start of the journey.')
  link = screen.getByRole('link', { name: 'example link' })
  expect(link).toHaveAttribute('href', 'https://www.example.com/')
})
