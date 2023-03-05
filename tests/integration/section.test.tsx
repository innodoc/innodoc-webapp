import { loadSection, render, screen } from '#test-utils'

import { Page } from '#pages/section/index.page'

test('pages/section', async () => {
  await loadSection('tempore-ut-id')

  render(<Page />)
  expect(screen.getByTestId('main-container')).toBeInTheDocument()

  await screen.findByRole('heading', { name: '1 Tempore ut id' })
  await screen.findByText(/Nesciunt possimus dolores molestias/)
  await screen.findByText(/Vero impedit quas fugiat facilis/)
})
