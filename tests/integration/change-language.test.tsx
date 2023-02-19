import { fireEvent, loadPage, render, screen, waitFor } from '#test-utils'

import { Page as ContentPage } from '#pages/page/index.page'

test('change language', async () => {
  await loadPage('home')

  render(<ContentPage />)

  // Check en version
  expect(
    screen.getByRole('heading', { name: 'Home page', exact: true, level: 1 })
  ).toBeInTheDocument()
  expect(screen.getAllByText('Course for integration tests').at(0)).toBeInTheDocument()
  expect(screen.getByText('This is the start of the journey.')).toBeInTheDocument()

  // Change language to de
  fireEvent.click(screen.getByRole('button', { name: 'nav.language', exact: true }))
  await waitFor(() => {
    expect(screen.getByRole('menuitem', { name: 'languages.de', exact: true })).toBeInTheDocument()
  })
  fireEvent.click(screen.getByRole('menuitem', { name: 'languages.de', exact: true }))

  // Check de version
  await waitFor(() => {
    expect(
      screen.getByRole('heading', { name: 'Home-Seite', exact: true, hidden: true, level: 1 })
    ).toBeInTheDocument()
  })
  await waitFor(() => {
    expect(screen.getAllByText('Kurs für integration tests').at(0)).toBeInTheDocument()
  })
  await waitFor(() => {
    expect(screen.getByText('Dies ist der Beginn der Reise.')).toBeInTheDocument()
  })

  // Change language back to en
  fireEvent.click(screen.getByRole('menuitem', { name: 'languages.en', exact: true }))

  // Check en version
  await waitFor(() => {
    expect(
      screen.getByRole('heading', { name: 'Home page', exact: true, hidden: true, level: 1 })
    ).toBeInTheDocument()
  })
  await waitFor(() => {
    expect(screen.getAllByText('Course for integration tests').at(0)).toBeInTheDocument()
  })
  await waitFor(() => {
    expect(screen.getByText('This is the start of the journey.')).toBeInTheDocument()
  })
})
