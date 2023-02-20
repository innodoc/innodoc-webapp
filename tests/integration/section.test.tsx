import { loadSection, render, screen } from '#test-utils'

import { Page as ContentSection } from '#pages/section/index.page'

test('<ContentSection />', async () => {
  await loadSection('tempore-ut-id')

  render(<ContentSection />)
  expect(screen.getByTestId('main-container')).toBeInTheDocument()

  await screen.findByRole('heading', { name: '1 Tempore ut id' })
  await screen.findByText(/Nesciunt possimus dolores molestias/)
  await screen.findByText(/Vero impedit quas fugiat facilis/)
})
